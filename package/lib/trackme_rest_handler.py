import os
import re
import sys
import json

from splunk.persistconn.application import PersistentServerConnectionApplication

if sys.platform == "win32":
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

class RequestInfo(object):
    """
    This represents the request.
    """

    def __init__(self, user, session_key, method, path, query, raw_args):
        self.user = user
        self.session_key = session_key
        self.method = method
        self.path = path
        self.query = query
        self.raw_args = raw_args

class RESTHandler(PersistentServerConnectionApplication):
    """
    This is a REST handler base-class that makes implementing a REST handler easier.
    
    This works by resolving a name based on the path in the HTTP request and calls it. This class
    will look for a function that includes the HTTP verb followed by the path.abs
    
    For example, if a GET request is made to the endpoint is executed with the path
    /lookup_edit/lookup_contents, then this class will attempt to run a function named
    get_lookup_contents(). Note that the root path of the REST handler is removed.

    If a POST request is made to the endpoint is executed with the path
    /lookup_edit/lookup_contents, the this class will attempt to execute post_lookup_contents().

    The arguments to the function will be the following:

      * request_info (an instance of RequestInfo)
      * keyword arguments (**kwargs)
    """

    def __init__(self, command_line, command_arg, logger=None):
        self.logger = logger
        PersistentServerConnectionApplication.__init__(self)

    @classmethod
    def get_function_signature(cls, method, path):
        """
        Get the function that should be called based on path and request method.
        """

        if len(path) > 0:
            return method + "_" + re.sub(r'[^a-zA-Z0-9_]', '_', path).lower()
        else:
            return method

    def render_json(self, data, response_code=200, headers=None):
        """
        Render the data as JSON
        """

        combined_headers = {
            'Content-Type': 'application/json'
        }

        if headers is not None:
            combined_headers.update(headers)

        return {
            'payload': json.dumps(data),
            'status': response_code,
            'headers': combined_headers,
        }

    def render_error_json(self, message, response_code=500):
        """
        Render an error to be returned to the client.
        """

        data = {
            'success' : False,
            'message' : message
        }

        return {
            'payload': json.dumps(data),
            'status': response_code,
            'headers': {
                'Content-Type': 'application/json'
            },
        }

    def get_forms_args_as_dict(self, form_args):
        
        post_arg_dict = {}

        for arg in form_args:
            name = arg[0]
            value = arg[1]

            post_arg_dict[name] = value

        return post_arg_dict

    def handle(self, in_string):
        try:

            self.logger.debug("Handling a request")

            # Parse the arguments
            args = self.parse_in_string(in_string)

            # Get the user information
            session_key = args['session']['authtoken']
            user = args['session']['user']

            # Get the method
            method = args['method']

            # Get the path and the args
            if 'path_info' in args:
                path = args['path_info']
            else:
                return {
                    'payload': 'No path was provided',
                    'status': 403
                }

            if method.lower() == 'post':
                # Load the parameters from the query
                query = args['query_parameters']

                if query is None:
                    query = {}

                # Apply the ones (if any) we got from the form
                query_form = self.get_forms_args_as_dict(args["form"])

                if query_form is not None:
                    query.update(query_form)
            else:
                query = args['query_parameters']

            # Make the request info object
            request_info = RequestInfo(user, session_key, method, path, query, args)

            # Get the function signature
            function_name = self.get_function_signature(method, path)

            try:
                function_to_call = getattr(self, function_name)
            except AttributeError:
                function_to_call = None

            # Try to run the function
            if function_to_call is not None:
                if self.logger is not None:
                    self.logger.debug("Executing function, name=%s", function_name)

                # Execute the function
                return function_to_call(request_info, **query)
            else:
                if self.logger is not None:
                    self.logger.warn("A request could not be executed since the associated function " +
                                    "is missing, name=%s", function_name)

                return {
                    'payload': 'Path was not found',
                    'status': 404
                }
        except Exception as exception:
            if self.logger is not None:
                self.logger.exception("Failed to handle request due to an unhandled exception")

            return {
                'payload': str(exception),
                'status': 500
            }

    def get_ping(self, request_info, **kwargs):
        """
        Return a response indicating that the REST handler is online.
        """

        return {
            'payload': 'Online',
            'status': 200,
            'headers': {
                'Content-Type': 'text/plain'
            },
        }

    def post_ping(self, request_info, **kwargs):
        """
        Return a response indicating that the REST handler is online.
        """

        return self.get_ping(request_info, **kwargs)

    def head_ping(self, request_info, **kwargs):
        """
        Return a response indicating that the REST handler is online.
        """

        return self.get_ping(request_info, **kwargs)

    def convert_to_dict(self, query):
        """
        Create a dictionary containing the parameters.
        """
        parameters = {}

        for key, val in query:

            # If the key is already in the list, but the existing entry isn't a list then make the
            # existing entry a list and add thi one
            if key in parameters and not isinstance(parameters[key], list):
                parameters[key] = [parameters[key], val]

            # If the entry is already included as a list, then just add the entry
            elif key in parameters:
                parameters[key].append(val)

            # Otherwise, just add the entry
            else:
                parameters[key] = val

        return parameters

    def parse_in_string(self, in_string):
        """
        Parse the in_string
        """

        params = json.loads(in_string)

        params['method'] = params['method'].lower()

        params['form_parameters'] = self.convert_to_dict(params.get('form', []))
        params['query_parameters'] = self.convert_to_dict(params.get('query', []))

        return params
