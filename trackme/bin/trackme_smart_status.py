
# encoding = utf-8
# Always put this line at the beginning of this file
import trackme_declare

import os
import sys

from alert_actions_base import ModularAlertBase
import modalert_trackme_smart_status_helper

class AlertActionWorkertrackme_smart_status(ModularAlertBase):

    def __init__(self, ta_name, alert_name):
        super(AlertActionWorkertrackme_smart_status, self).__init__(ta_name, alert_name)

    def validate_params(self):

        if not self.get_param("object_category"):
            self.log_error('object_category is a mandatory parameter, but its value is None.')
            return False

        if not self.get_param("object_name"):
            self.log_error('object_name is a mandatory parameter, but its value is None.')
            return False
        return True

    def process_event(self, *args, **kwargs):
        status = 0
        try:
            if not self.validate_params():
                return 3
            status = modalert_trackme_smart_status_helper.process_event(self, *args, **kwargs)
        except (AttributeError, TypeError) as ae:
            self.log_error("Error: {}. Please double check spelling and also verify that a compatible version of Splunk_SA_CIM is installed.".format(str(ae)))
            return 4
        except Exception as e:
            msg = "Unexpected error: {}."
            if e:
                self.log_error(msg.format(str(e)))
            else:
                import traceback
                self.log_error(msg.format(traceback.format_exc()))
            return 5
        return status

if __name__ == "__main__":
    exitcode = AlertActionWorkertrackme_smart_status("trackme", "trackme_smart_status").run(sys.argv)
    sys.exit(exitcode)
