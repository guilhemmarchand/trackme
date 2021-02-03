import logging
import os, sys, shutil
import tarfile
import csv
import time
import splunk
import splunk.entity
import splunk.Intersplunk
import json

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler
import splunklib.client as client


class TrackMeHandlerBackupAndRestore_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerBackupAndRestore_v1, self).__init__(command_line, command_arg, logger)

    # Get the entire data sources collection as a Python array
    def post_backup(self, request_info, **kwargs):

        describe = False

        # Retrieve from data
        try:
            resp_dict = json.loads(str(request_info.raw_args['payload']))
        except Exception as e:
            resp_dict = None

        if resp_dict is not None:
            try:
                describe = resp_dict['describe']
                if describe in ("true", "True"):
                    describe = True
            except Exception as e:
                describe = False
        else:
            # body is not required in this endpoint, if not submitted do not describe the usage
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint performs a backup of all TrackMe collections in compressed tarball "\
            + "file stored in the backup directory of the application, it requires a POST call with no arguments.\"}"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        else:

            # Get splunkd port
            entity = splunk.entity.getEntity('/server', 'settings',
                                                namespace='trackme', sessionKey=request_info.session_key, owner='-')
            splunkd_port = entity['mgmtHostPort']

            # Set backup root dir
            backuproot = os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'backup')

            # Set timestr
            timestr = time.strftime("trackme-backup-%Y%m%d-%H%M%S")

            # Set backup dir
            backupdir = os.path.join(backuproot, str(timestr))

            # Create the backup dir if does not exist
            if not os.path.isdir(backuproot):
                os.mkdir(backuproot)
            if not os.path.isdir(backupdir):
                os.mkdir(backupdir)

            # Set up service
            service = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )

            # Go

            # define empty list
            collection_list = []

            # Get the Kvstore collections to be backed up from a lookup stored in the app
            try:
                with open(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lookups', 'trackme_kvstore_collections.csv'), newline='') as f:
                    reader = csv.reader(f)
                    collection_list = list(reader)

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                }

            # to get rid of the header
            counter = 0

            # to count the number of non empty collections backed up
            counter_performed = 0

            # to count the number of empty collections
            counter_empty = 0

            for run_collection in collection_list:

                if counter == 0:
                    counter +=1
                
                else:

                    counter +=1
                    try:

                        collection_name = run_collection[0]
                        collection = service.kvstore[collection_name]

                        if str(json.dumps(collection.data.query(), indent=1)) in "[]":
                            counter_empty +=1

                        else:
                            target = os.path.join(backupdir, collection_name + '.json')
                            
                            try:
                            
                                with open(target, 'w') as f:
                                    f.write(json.dumps(collection.data.query(), indent=1))
                                counter_performed +=1

                            except Exception as e:

                                return {
                                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                }

                    except Exception as e:
                        return {
                            'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                        }

            # create a tgz
            import tarfile
            tar_name = str(backupdir) + '.tgz'

            try:
                with tarfile.open(tar_name, "w:gz") as tar_handle:
                    for root, dirs, files in os.walk(backupdir):
                        for file in files:
                            tar_handle.add(os.path.join(root, file))
            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                }

            # remove backup dir
            try:
                shutil.rmtree(backupdir)

            except OSError as e:
                return {
                    'payload': "Error: %s : %s" % (backupdir, e.strerror)
                }                                        

            # Render
            return {
                "payload": "{ \"backup_archive\": \"" + str(tar_name) + "\", \"report\": \""\
                    + str(counter_performed) + " collections backed up / " + str(counter_empty) + " collections empty\"}",
                'status': 200 # HTTP status code
            }
