from pylon.core.tools import log  # pylint: disable=E0611,E0401
from pylon.core.tools import web

from tools import rpc_tools


class RPC:
    integration_name = 'security_scanner_python'

    @web.rpc(f'dusty_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def make_dusty_config(self, context, test_params, scanner_params):
        """ Prepare dusty config for this scanner """
        result = {'code': '/tmp/code', **scanner_params}
        if result.get('requirements'):
            result['composition_analysis'] = True
            reqs = []
            for req in result['requirements']:
                if req[0] == "/":
                    reqs.append(req)
                    continue
                reqs.append(result['code'] + '/' + req)
            result['requirements'] = reqs
        else:
            result.pop('requirements', None)
            result['composition_analysis'] = False

        return "python", result
