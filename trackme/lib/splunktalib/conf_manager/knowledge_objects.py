# SPDX-FileCopyrightText: 2020 Splunk Inc.
#
# SPDX-License-Identifier: Apache-2.0

from builtins import object
import splunktalib.common.xml_dom_parser as xdp
import splunktalib.conf_manager.request as req


class KnowledgeObjectManager(object):
    def __init__(self, splunkd_uri, session_key):
        self.splunkd_uri = splunkd_uri
        self.session_key = session_key

    def apps(self):
        """
        @return: a list of dict containing apps if successfuly otherwise
        otherwise raise exceptions
        """

        uri = "{}/services/apps/local?count=0&offset=0".format(self.splunkd_uri)
        apps = self._do_request(uri, "GET", None, "Failed to get apps")
        return apps

    def indexes(self):
        """
        @return: a list of dict containing indexes if successfuly
        otherwise raise exceptions
        """

        uri = "{}/services/data/indexes/?count=0&offset=0".format(self.splunkd_uri)
        indexes = self._do_request(uri, "GET", None, "Failed to get indexes")
        return indexes

    def _do_request(self, uri, method, payload, err_msg):
        _, content = req.content_request(
            uri, self.session_key, method, payload, err_msg
        )
        return xdp.parse_conf_xml_dom(content)
