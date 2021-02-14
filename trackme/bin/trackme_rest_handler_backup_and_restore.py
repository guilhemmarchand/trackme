import logging
import os, sys, shutil
import tarfile
import csv
import time, datetime
import splunk
import splunk.entity
import splunk.Intersplunk
import json
import socket
import hashlib

logger = logging.getLogger(__name__)

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'lib'))

import rest_handler
import splunklib.client as client

#
# Splunk Cloud certification notes: these functions create and manage archive files for the application in the following directory $SPLUNK/etc/apps/trackme/backup
# There are no options to perform any kind of file manipulations out of this application directory
#

class TrackMeHandlerBackupAndRestore_v1(rest_handler.RESTHandler):
    def __init__(self, command_line, command_arg):
        super(TrackMeHandlerBackupAndRestore_v1, self).__init__(command_line, command_arg, logger)

    # List backup archive files known from the KV, add any local file that the KV wouldn't do about
    def get_backup(self, request_info, **kwargs):

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

            response = "{\"describe\": \"This endpoint lists all the backup files available on the search head, "\
            + "files are stored in the backup directory of the application, it requires a GET call with no arguments.\"}"

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

            # get local server name
            server_name = socket.gethostname()

            # check backup dir existence
            if not os.path.isdir(backuproot):

                return {
                    "payload": "{\"There are no backup archives available on this instance\"}",
                    'status': 200 # HTTP status code
                }

            else:

                # store files in list
                from os import listdir
                from os.path import isfile, join
                backup_files = [join(backuproot, f) for f in listdir(backuproot) if isfile(join(backuproot, f))]

                if not backup_files:

                    return {
                        "payload": "{\"There are no backup archives available on this instance\"}",
                        'status': 200 # HTTP status code
                    }

                else:

                    # Enter the list, verify for that for each archive file we have a corresponding record in the audit collection
                    # if there is no record, then we create a replacement record
                    for backup_file in backup_files:

                        # get the file mtime
                        backup_file_mtime = round(os.path.getmtime(backup_file))

                        # Store a record in a backup audit collection

                        # Create a message
                        status_message = "discovered"

                        # record / key
                        record = None
                        key = None

                        # Define the KV query
                        query_string = '{ "$and": [ { "backup_archive": "' + backup_file + '" }, { "server_name' + '": "' + server_name + '" } ] }'

                        # backup audit collection
                        collection_name_backup_archives_info = "kv_trackme_backup_archives_info"            
                        service_backup_archives_info = client.connect(
                            owner="nobody",
                            app="trackme",
                            port=splunkd_port,
                            token=request_info.session_key
                        )
                        collection_backup_archives_info = service_backup_archives_info.kvstore[collection_name_backup_archives_info]

                        try:
                            record = collection_backup_archives_info.data.query(query=str(query_string))
                            key = record[0].get('_key')

                        except Exception as e:
                            key = None

                        # If a record cannot be found, this backup file is not know to TrackMe currently, add a new record
                        if key is None:

                            try:

                                # Insert the record
                                collection_backup_archives_info.data.insert(json.dumps({
                                    "mtime": str(backup_file_mtime),
                                    "htime": str(datetime.datetime.fromtimestamp(int(backup_file_mtime)).strftime('%c')),
                                    "server_name": str(server_name),
                                    "status": str(status_message),
                                    "change_type": "backup archive was missing from the info collection and added by automatic discovery",
                                    "backup_archive": str(backup_file)
                                    }))

                            except Exception as e:
                                return {
                                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                }

                    # Render
                    return {
                        "payload": collection_backup_archives_info.data.query(),
                        'status': 200 # HTTP status code
                    }

    # Take a backup
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

            response = "{\"describe\": \"This endpoint performs a backup of all TrackMe collections in a compressed tarball "\
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

            # get local server name
            server_name = socket.gethostname()

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
                with tarfile.open(tar_name, mode='w:gz') as archive:
                    archive.add(backupdir, arcname='')

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

            # Store a record in a backup audit collection

            # backup audit collection
            collection_name_backup_archives_info = "kv_trackme_backup_archives_info"            
            service_backup_archives_info = client.connect(
                owner="nobody",
                app="trackme",
                port=splunkd_port,
                token=request_info.session_key
            )
            collection_backup_archives_info = service_backup_archives_info.kvstore[collection_name_backup_archives_info]

            # Get time
            current_time = int(round(time.time()))

            # Create a message
            status_message = "{\"backup_archive\": \"" + str(tar_name) + "\", \"report\": \""\
                    + str(counter_performed) + " collections backed up / " + str(counter_empty) + " collections empty\"}"

            try:

                # Insert the record
                collection_backup_archives_info.data.insert(json.dumps({
                    "mtime": str(current_time),
                    "htime": str(datetime.datetime.fromtimestamp(int(current_time)).strftime('%c')),
                    "server_name": str(server_name),
                    "status": str(status_message),
                    "change_type": "backup archive created",
                    "backup_archive": str(os.path.join(backupdir, tar_name))
                    }))

            except Exception as e:
                return {
                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                }

            # Finally render a status message
            return {
                "payload": str(status_message),
                'status': 200 # HTTP status code
            }


    # Purge older backup archives based on a retention
    def delete_backup(self, request_info, **kwargs):

        describe = False
        retention_days = 7 # default to 7 days of retention if not specified

        # Get splunkd port
        entity = splunk.entity.getEntity('/server', 'settings',
                                            namespace='trackme', sessionKey=request_info.session_key, owner='-')
        splunkd_port = entity['mgmtHostPort']

        # get local server name
        server_name = socket.gethostname()

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

            # Get the mandatory backup_archive name
            try:
                retention_days = resp_dict['retention_days']

                # convert to an integer
                try:
                    retention_days = int(retention_days)

                except Exception as e:
                    return {
                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                    }

            except Exception as e:
                # default to 7 days
                retention_days = 7

        else:
            # body is not required in this endpoint
            describe = False

        if describe:

            response = "{\"describe\": \"This endpoint performs a purge of backup archive files older than x days, it requires a DELETE call with the following arguments:\""\
                + ", \"options\" : [ { "\
                + "\"retention_days\": \"(integer) OPTIONAL: the maximal retention for backup archive files in days, if not specified defaults to 7 days\""\
                + " } ] }"

            return {
                "payload": json.dumps(json.loads(str(response)), indent=1),
                'status': 200 # HTTP status code
            }

        else:

            # Set backup root dir
            backuproot = os.path.join(splunkhome, 'etc', 'apps', 'trackme', 'backup')

            # For reporting purposes
            purgedlist = None

            #retention_days = 7

            time_in_secs = time.time() - (retention_days * 24 * 60 * 60)
            for root, dirs, files in os.walk(backuproot, topdown=False):
                for file_ in files:
                    full_path = os.path.join(root, file_)
                    stat = os.stat(full_path)
                    
                    if stat.st_mtime <= time_in_secs:

                        if os.path.isdir(full_path):
                            try:
                                os.rmdir(full_path)
                                if purgedlist is not None:
                                    purgedlist = str(purgedlist) + ", [ " + str(full_path) + " ]"
                                else:
                                    purgedlist = "[ " + str(full_path) + " ]"
                            except Exception as e:
                                return {
                                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                }
                        else:
                            try:
                                if os.path.exists(full_path):
                                    os.remove(full_path)
                                    if purgedlist is not None:
                                        purgedlist = str(purgedlist) + ", [ " + str(full_path) + " ]"
                                    else:
                                        purgedlist = "[ " + str(full_path) + " ]"
                            except Exception as e:
                                return {
                                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                }

            if purgedlist is None:

                return {
                    "payload": "{\"status\": \"There were no backup archive files older than " + str(retention_days) + " days to be purged\"}",
                    'status': 200 # HTTP status code
                }
            else:

                # For each backup archive, if a record is found in the collection info, remove the record

                # backup audit collection
                collection_name_backup_archives_info = "kv_trackme_backup_archives_info"            
                service_backup_archives_info = client.connect(
                    owner="nobody",
                    app="trackme",
                    port=splunkd_port,
                    token=request_info.session_key
                )
                collection_backup_archives_info = service_backup_archives_info.kvstore[collection_name_backup_archives_info]

                for backup_file in purgedlist:

                    key = None
                    record = None

                    # Define the KV query
                    query_string = '{ "$and": [ { "backup_archive": "' + backup_file + '" }, { "server_name' + '": "' + server_name + '" } ] }'

                    try:
                        record = collection_backup_archives_info.data.query(query=str(query_string))
                        key = record[0].get('_key')

                    except Exception as e:
                        key = None

                    # If a record is found, it shall be purged
                    if key is not None:

                        # Remove the record
                        collection_backup_archives_info.data.delete(json.dumps({"_key":key}))

                return {
                    "payload": "{\"status\": \"The following archive files were purged due to retention (" + str(retention_days)\
                    + " days)\", \"backup_files\": \"" + str(purgedlist) + "\"}",
                    'status': 200 # HTTP status code
                }


    # Restore collections from a backup archive
    # For Splunk Cloud certification purposes, the archive must be located in the backup directory of the application

    def post_restore(self, request_info, **kwargs):

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

            if not describe:

                # Get the mandatory backup_archive name
                try:
                    backup_archive = resp_dict['backup_archive']
                except Exception as e:
                    return {
                        "payload": "{\"response\": \"ERROR: the archive name (backup_archive) to be used for restoring is a mandatory argument}"
                    }

                # Dry run mode, preview and verify the restore operation, but do not do anything
                # default to false
                try:
                    dry_run = resp_dict['dry_run']
                    if dry_run in ("True", "true"):
                        dry_run = True
                    else:
                        dry_run = False
                except Exception as e:
                    dry_run = True

                # Restore target, valid option are all (default) or the name of one of the KVstore collections
                # default to all if not specified
                try:
                    target = resp_dict['target']
                    if target in ("all"):
                        restore_all = True
                    else:
                        restore_all = False
                except Exception as e:
                    restore_all = True

        else:
            # body is required in this endpoint, if not submitted describe the usage
            describe = True

        if describe:

            response = "{\"describe\": \"This endpoint performs a restore of all TrackMe collections from a compressed tarball backup file"\
            + "file stored in the backup directory ($SPLUNK_HOME/etc/apps/trackme/backup) of the application, it requires a POST call with thre following arguments:\""\
            + ", \"options\" : [ { "\
            + "\"dry_run\": \"(true / false) OPTIONAL: if true, the endpoint will only verify that the archive can be found and successfully extracted, there will be no modifications at all. (default to true)\","\
            + "\"target\": \"(all / name of the KVstore json file) OPTIONAL: restore all available KVstore collection files (all) or choose a specific KVstore json file target to restore a unique collection. (default to all)\","\
            + "\"backup_archive\": \"The archive file to be restoring from, the tarball compressed file must be located in the backup directory of the trackMe application.\""\
            + " } ] }"

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

            # Set the submitted full path of the archive file
            backupfile = os.path.join(backuproot, backup_archive)

            # Set the full path of the directory for the extraction
            backupdir = os.path.splitext(backupfile)[0]

            # First, check the backup archive existence
            if not os.path.isfile(backupfile):
                return {
                    "payload": "{\"response\": \"ERROR: the archive name " + str(backupfile) + " could not be found, restore cannot be processed\"}"
                }

            # Attempt extraction
            try:
                shutil.unpack_archive(backupfile, backupdir)

            except Exception as e:
                return {
                    "payload": "{\"response\": \"ERROR: the archive name " + str(backupfile) + " could not be extracted, restore cannot be processed: \"" + str(e) + "}"
                }

            # store files in list
            from os import listdir
            from os.path import isfile, join            
            collections_json_files = [f for f in listdir(backupdir) if isfile(join(backupdir, f))]

            if dry_run:

                # remove backup dir
                try:
                    shutil.rmtree(backupdir)

                except OSError as e:
                    return {
                        'payload': "Error: %s : %s" % (backupdir, e.strerror)
                    }                                        

                return {
                    "payload": "{\"response\": \"Success: the archive " + str(backupfile) + " could be successfully extracted, "\
                        + "the following KVstore collections can be restored (empty collections are not backed up)\", \"collections\": \"" + str(collections_json_files) + "\"}",
                    'status': 200 # HTTP status code
                }

            else:

                # Set up service
                service = client.connect(
                    owner="nobody",
                    app="trackme",
                    port=splunkd_port,
                    token=request_info.session_key
                )

                # Things are serious now, let's restore collection per collection                
                if restore_all:
                
                    # define empty list
                    collection_list = []

                    # Step 1: flush all KVstore collections, TrackMe should be restored to the backup state

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

                    for run_collection in collection_list:

                        if counter == 0:
                            counter +=1
                        
                        else:

                            counter +=1
                            try:

                                collection_name = run_collection[0]
                                collection = service.kvstore[collection_name]

                                # Delete the entire collection content
                                try:
                                    collection.data.delete()

                                except Exception as e:
                                    return {
                                        'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                    }

                            except Exception as e:
                                return {
                                    'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                                }

                    for collection_backup_json in collections_json_files:

                        collection_target = os.path.splitext(collection_backup_json)[0]
                        collection_source_file = os.path.join(backupdir, collection_backup_json)

                        # connect to collection
                        collection = service.kvstore[collection_target]

                        # Load the json data
                        f = open (collection_source_file, "r")
                        data = json.loads(f.read())

                        # Restore from the json file
                        try:
                            collection.data.batch_save(*data)
                        except Exception as e:
                            return {
                                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                            }

                        # clean out
                        f.close()

                else:

                    if target:

                        collection_target = os.path.splitext(target)[0]
                        collection_source_file = os.path.join(backupdir, target)

                        # check the json backup file existence
                        if not os.path.isfile(collection_source_file):
                            return {
                                "payload": "{\"response\": \"ERROR: the json file " + str(collection_source_file) + " could not be found, restore cannot be processed\"}"
                            }

                        # connect to collection
                        collection = service.kvstore[collection_target]

                        # Load the json data
                        f = open (collection_source_file, "r")
                        data = json.loads(f.read())

                        # Delete the entire collection content
                        try:
                            collection.data.delete()

                        except Exception as e:
                            return {
                                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                            }

                        # Restore from the json file
                        try:
                            collection.data.batch_save(*data)
                        except Exception as e:
                            return {
                                'payload': 'Warn: exception encountered: ' + str(e) # Payload of the request.
                            }

                        # clean out
                        f.close()

                # Finally remove the temporary directory
                try:
                    shutil.rmtree(backupdir)

                except OSError as e:
                    return {
                        'payload': "Error: %s : %s" % (backupdir, e.strerror)
                    }

            if not restore_all:
                result = "{ \"backup_archive\": \"" + str(backupfile) + "\", \"status\": \"restore is now complete, please reload TrackMe\","\
                    + "\"collections_files_restored\": \"" + str(target) + "\"}"
            else:
                result = "{ \"backup_archive\": \"" + str(backupfile) + "\", \"status\": \"restore is now complete, please reload TrackMe\","\
                    + "\"collections_files_restored\": \"" + str(collections_json_files) + "\"}"

            return {
                "payload": str(result),
                'status': 200 # HTTP status code
            }
