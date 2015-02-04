#!/usr/bin/env python3
#-*- coding:utf-8 -*-
# start a python service and watch the nginx request dog

from http.server import HTTPServer,CGIHTTPRequestHandler
from threading import Thread,RLock
import subprocess
import logging
import sys
import os.path


_PWD=os.path.abspath(os.path.dirname(__file__))
def execute_cmd(args,cwd=None,timeout=30):
    if isinstance(args,str): args = [args]
    try:
        with subprocess.Popen(args,stdout=subprocess.PIPE,cwd=cwd) as proc:
            try:
                output,unused_err = proc.communicate(timeout=timeout)
            except:
                proc.kill()
                raise
            retcode = proc.poll()
            if retcode:
                raise subprocess.CalledProcessError(retcode, proc.args, output=output)
            return output.decode('utf-8','ignore') if output else ''
    except Exception as ex:
        logging.error('EXECUTE_CMD_ERROR: %s',' '.join(str(x) for x in args))
        raise ex

class HttpHandler(CGIHTTPRequestHandler):
    _lock = RLock()
    _counter = 0
    _building = False

    def build(self):
        with HttpHandler._lock:
            if HttpHandler._counter == 0 or HttpHandler._building:
                return
        HttpHandler._counter = 0
        HttpHandler._building = True
        logging.info("BUILDING NOW...")
        try:
            resp = execute_cmd(os.path.join(_PWD,'build.sh'),cwd=_PWD,timeout=600)
            logging.info(resp)
        finally:
            HttpHandler._building = False
            self.build()

    def do_GET(self):
        self.do_POST()
    def do_POST(self):
        self.send_response(200,'OK')
        self.end_headers()
        self.wfile.write(b'OK')
        self.wfile.flush()
        with HttpHandler._lock:
            HttpHandler._counter += 1
        Thread(target=self.build).start()

if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s',level=logging.INFO)

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 1111
    logging.info('starting the server at 127.0.0.1:%s',port)
    httpd = HTTPServer(('127.0.0.1',port),HttpHandler)
    httpd.serve_forever()
