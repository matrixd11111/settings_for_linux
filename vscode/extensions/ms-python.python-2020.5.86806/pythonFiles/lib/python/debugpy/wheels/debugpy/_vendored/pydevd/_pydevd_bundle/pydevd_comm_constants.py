CMD_RUN = 101
CMD_LIST_THREADS = 102
CMD_THREAD_CREATE = 103
CMD_THREAD_KILL = 104
CMD_THREAD_SUSPEND = 105
CMD_THREAD_RUN = 106
CMD_STEP_INTO = 107
CMD_STEP_OVER = 108
CMD_STEP_RETURN = 109
CMD_GET_VARIABLE = 110
CMD_SET_BREAK = 111
CMD_REMOVE_BREAK = 112
CMD_EVALUATE_EXPRESSION = 113
CMD_GET_FRAME = 114
CMD_EXEC_EXPRESSION = 115
CMD_WRITE_TO_CONSOLE = 116
CMD_CHANGE_VARIABLE = 117
CMD_RUN_TO_LINE = 118
CMD_RELOAD_CODE = 119
CMD_GET_COMPLETIONS = 120

# Note: renumbered (conflicted on merge)
CMD_CONSOLE_EXEC = 121
CMD_ADD_EXCEPTION_BREAK = 122
CMD_REMOVE_EXCEPTION_BREAK = 123
CMD_LOAD_SOURCE = 124
CMD_ADD_DJANGO_EXCEPTION_BREAK = 125
CMD_REMOVE_DJANGO_EXCEPTION_BREAK = 126
CMD_SET_NEXT_STATEMENT = 127
CMD_SMART_STEP_INTO = 128
CMD_EXIT = 129
CMD_SIGNATURE_CALL_TRACE = 130

CMD_SET_PY_EXCEPTION = 131
CMD_GET_FILE_CONTENTS = 132
CMD_SET_PROPERTY_TRACE = 133
# Pydev debug console commands
CMD_EVALUATE_CONSOLE_EXPRESSION = 134
CMD_RUN_CUSTOM_OPERATION = 135
CMD_GET_BREAKPOINT_EXCEPTION = 136
CMD_STEP_CAUGHT_EXCEPTION = 137
CMD_SEND_CURR_EXCEPTION_TRACE = 138
CMD_SEND_CURR_EXCEPTION_TRACE_PROCEEDED = 139
CMD_IGNORE_THROWN_EXCEPTION_AT = 140
CMD_ENABLE_DONT_TRACE = 141
CMD_SHOW_CONSOLE = 142

CMD_GET_ARRAY = 143
CMD_STEP_INTO_MY_CODE = 144
CMD_GET_CONCURRENCY_EVENT = 145
CMD_SHOW_RETURN_VALUES = 146
CMD_INPUT_REQUESTED = 147
CMD_GET_DESCRIPTION = 148

CMD_PROCESS_CREATED = 149
CMD_SHOW_CYTHON_WARNING = 150
CMD_LOAD_FULL_VALUE = 151

CMD_GET_THREAD_STACK = 152

# This is mostly for unit-tests to diagnose errors on ci.
CMD_THREAD_DUMP_TO_STDERR = 153

# Sent from the client to signal that we should stop when we start executing user code.
CMD_STOP_ON_START = 154

# When the debugger is stopped in an exception, this command will provide the details of the current exception (in the current thread).
CMD_GET_EXCEPTION_DETAILS = 155

# Allows configuring pydevd settings (can be called multiple times and only keys
# available in the json will be configured -- keys not passed will not change the
# previous configuration).
CMD_PYDEVD_JSON_CONFIG = 156

CMD_THREAD_SUSPEND_SINGLE_NOTIFICATION = 157
CMD_THREAD_RESUME_SINGLE_NOTIFICATION = 158

CMD_STEP_OVER_MY_CODE = 159
CMD_STEP_RETURN_MY_CODE = 160

CMD_REDIRECT_OUTPUT = 200
CMD_GET_NEXT_STATEMENT_TARGETS = 201
CMD_SET_PROJECT_ROOTS = 202

CMD_MODULE_EVENT = 203
CMD_PROCESS_EVENT = 204

CMD_AUTHENTICATE = 205

CMD_STEP_INTO_COROUTINE = 206

CMD_LOAD_SOURCE_FROM_FRAME_ID = 207

CMD_VERSION = 501
CMD_RETURN = 502
CMD_SET_PROTOCOL = 503
CMD_ERROR = 901

# this number can be changed if there's need to do so
# if the io is too big, we'll not send all (could make the debugger too non-responsive)
MAX_IO_MSG_SIZE = 10000

VERSION_STRING = "@@BUILD_NUMBER@@"

from _pydev_bundle._pydev_filesystem_encoding import getfilesystemencoding
file_system_encoding = getfilesystemencoding()
filesystem_encoding_is_utf8 = file_system_encoding.lower() in ('utf-8', 'utf_8', 'utf8')

ID_TO_MEANING = {
    '101': 'CMD_RUN',
    '102': 'CMD_LIST_THREADS',
    '103': 'CMD_THREAD_CREATE',
    '104': 'CMD_THREAD_KILL',
    '105': 'CMD_THREAD_SUSPEND',
    '106': 'CMD_THREAD_RUN',
    '107': 'CMD_STEP_INTO',
    '108': 'CMD_STEP_OVER',
    '109': 'CMD_STEP_RETURN',
    '110': 'CMD_GET_VARIABLE',
    '111': 'CMD_SET_BREAK',
    '112': 'CMD_REMOVE_BREAK',
    '113': 'CMD_EVALUATE_EXPRESSION',
    '114': 'CMD_GET_FRAME',
    '115': 'CMD_EXEC_EXPRESSION',
    '116': 'CMD_WRITE_TO_CONSOLE',
    '117': 'CMD_CHANGE_VARIABLE',
    '118': 'CMD_RUN_TO_LINE',
    '119': 'CMD_RELOAD_CODE',
    '120': 'CMD_GET_COMPLETIONS',
    '121': 'CMD_CONSOLE_EXEC',
    '122': 'CMD_ADD_EXCEPTION_BREAK',
    '123': 'CMD_REMOVE_EXCEPTION_BREAK',
    '124': 'CMD_LOAD_SOURCE',
    '125': 'CMD_ADD_DJANGO_EXCEPTION_BREAK',
    '126': 'CMD_REMOVE_DJANGO_EXCEPTION_BREAK',
    '127': 'CMD_SET_NEXT_STATEMENT',
    '128': 'CMD_SMART_STEP_INTO',
    '129': 'CMD_EXIT',
    '130': 'CMD_SIGNATURE_CALL_TRACE',

    '131': 'CMD_SET_PY_EXCEPTION',
    '132': 'CMD_GET_FILE_CONTENTS',
    '133': 'CMD_SET_PROPERTY_TRACE',
    '134': 'CMD_EVALUATE_CONSOLE_EXPRESSION',
    '135': 'CMD_RUN_CUSTOM_OPERATION',
    '136': 'CMD_GET_BREAKPOINT_EXCEPTION',
    '137': 'CMD_STEP_CAUGHT_EXCEPTION',
    '138': 'CMD_SEND_CURR_EXCEPTION_TRACE',
    '139': 'CMD_SEND_CURR_EXCEPTION_TRACE_PROCEEDED',
    '140': 'CMD_IGNORE_THROWN_EXCEPTION_AT',
    '141': 'CMD_ENABLE_DONT_TRACE',
    '142': 'CMD_SHOW_CONSOLE',
    '143': 'CMD_GET_ARRAY',
    '144': 'CMD_STEP_INTO_MY_CODE',
    '145': 'CMD_GET_CONCURRENCY_EVENT',
    '146': 'CMD_SHOW_RETURN_VALUES',
    '147': 'CMD_INPUT_REQUESTED',
    '148': 'CMD_GET_DESCRIPTION',

    '149': 'CMD_PROCESS_CREATED',  # Note: this is actually a notification of a sub-process created.
    '150': 'CMD_SHOW_CYTHON_WARNING',
    '151': 'CMD_LOAD_FULL_VALUE',
    '152': 'CMD_GET_THREAD_STACK',
    '153': 'CMD_THREAD_DUMP_TO_STDERR',
    '154': 'CMD_STOP_ON_START',
    '155': 'CMD_GET_EXCEPTION_DETAILS',
    '156': 'CMD_PYDEVD_JSON_CONFIG',
    '157': 'CMD_THREAD_SUSPEND_SINGLE_NOTIFICATION',
    '158': 'CMD_THREAD_RESUME_SINGLE_NOTIFICATION',

    '159': 'CMD_STEP_OVER_MY_CODE',
    '160': 'CMD_STEP_RETURN_MY_CODE',

    '200': 'CMD_REDIRECT_OUTPUT',
    '201': 'CMD_GET_NEXT_STATEMENT_TARGETS',
    '202': 'CMD_SET_PROJECT_ROOTS',
    '203': 'CMD_MODULE_EVENT',
    '204': 'CMD_PROCESS_EVENT',  # DAP process event.

    '205': 'CMD_AUTHENTICATE',

    '206': 'CMD_STEP_INTO_COROUTINE',

    '207': 'CMD_LOAD_SOURCE_FROM_FRAME_ID',

    '501': 'CMD_VERSION',
    '502': 'CMD_RETURN',
    '503': 'CMD_SET_PROTOCOL',
    '901': 'CMD_ERROR',
}


def constant_to_str(constant):
    s = ID_TO_MEANING.get(str(constant))
    if not s:
        s = '<Unknown: %s>' % (constant,)
    return s
