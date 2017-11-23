#!/usr/bin/env python
#  Copyright (c) 2012 The WebRTC project authors. All Rights Reserved.
#
#  Use of this source code is governed by a BSD-style license
#  that can be found in the LICENSE file in the root of the source
#  tree. An additional intellectual property rights grant can be found
#  in the file PATENTS.  All contributing project authors may
#  be found in the AUTHORS file in the root of the source tree.

"""Script for constraining traffic on the local machine."""


import logging
import optparse
import socket
import sys

import config
import network_emulator


_DEFAULT_LOG_LEVEL = logging.INFO

# Default port range to apply network constraints on.
_DEFAULT_PORT_RANGE = (0, 65535)

# The numbers below are gathered from Google stats from the presets of the Apple
# developer tool called Network Link Conditioner.
_PRESETS = [
    config.ConnectionConfig(1, '3G, Good', 6400, 2000, 40, 0.5, 100),
    config.ConnectionConfig(2, '3G, Lossy Network', 802, 200, 260, 5, 100),
    config.ConnectionConfig(3, '4G, Good', 9000, 4000, 24, 0.2, 100),
    config.ConnectionConfig(4, '4G, Lossy Network', 2780, 1000, 184, 5, 10),
    config.ConnectionConfig(5, 'ADSL,Good', 100000, 4000, 24, 0.2, 100),
    config.ConnectionConfig(6, 'ADSL,Lossy Network', 100000, 2000, 100, 10, 100),
    config.ConnectionConfig(7, 'Wifi, Good', 100000, 100000, 0, 0, 100),
    config.ConnectionConfig(8, 'Wifi, Lossy', 100000, 100000, 100, 10, 100),
    config.ConnectionConfig(9, 'Wifi, lost 3%', 100000, 100000, 0, 3, 100),
    config.ConnectionConfig(10, 'Wifi, lost 5%', 100000, 100000, 0, 5, 100),
    config.ConnectionConfig(11, 'Wifi, lost 7%', 100000, 100000, 0, 7, 100),
    config.ConnectionConfig(12, 'Wifi, lost 10%', 100000, 100000, 0, 10, 100),
    config.ConnectionConfig(13, 'Wifi, lost 15%', 100000, 100000, 0, 15, 100),
    config.ConnectionConfig(14, 'Wifi, lost 20%', 100000, 100000, 0, 20, 100),
    config.ConnectionConfig(15, 'Wifi, lost 25%', 100000, 100000, 0, 25, 100),
    config.ConnectionConfig(16, 'Wifi, lost 30%', 100000, 100000, 0, 30, 100),
    ]
_PRESETS_DICT = dict((p.num, p) for p in _PRESETS)

_DEFAULT_PRESET_ID = 10
_DEFAULT_PRESET = _PRESETS_DICT[_DEFAULT_PRESET_ID]


class NonStrippingEpilogOptionParser(optparse.OptionParser):
  """Custom parser to let us show the epilog without weird line breaking."""

  def format_epilog(self, formatter):
    return self.epilog


def _get_external_ip():
  """Finds out the machine's external IP by connecting to google.com."""
  external_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  external_socket.connect(('google.com', 80))
  return external_socket.getsockname()[0]


def _parse_args():
  """Define and parse the command-line arguments."""
  presets_string = '\n'.join(str(p) for p in _PRESETS)
  parser = NonStrippingEpilogOptionParser(epilog=(
      '\nAvailable presets:\n'
      '                              Bandwidth (kbps)                  Packet\n'
      'ID Name                       Receive     Send    Queue  Delay   loss \n'
      '-- ----                      ---------   -------- ----- ------- ------\n'
      '%s\n' % presets_string))
  parser.add_option('-p', '--preset', type='int', default=_DEFAULT_PRESET_ID,
                    help=('ConnectionConfig configuration, specified by ID. '
                          'Default: %default'))
  parser.add_option('-r', '--receive-bw', type='int',
                    default=_DEFAULT_PRESET.receive_bw_kbps,
                    help=('Receive bandwidth in kilobit/s. Default: %default'))
  parser.add_option('-s', '--send-bw', type='int',
                    default=_DEFAULT_PRESET.send_bw_kbps,
                    help=('Send bandwidth in kilobit/s. Default: %default'))
  parser.add_option('-d', '--delay', type='int',
                    default=_DEFAULT_PRESET.delay_ms,
                    help=('Delay in ms. Default: %default'))
  parser.add_option('-l', '--packet-loss', type='float',
                    default=_DEFAULT_PRESET.packet_loss_percent,
                    help=('Packet loss in %. Default: %default'))
  parser.add_option('-q', '--queue', type='int',
                    default=_DEFAULT_PRESET.queue_slots,
                    help=('Queue size as number of slots. Default: %default'))
  parser.add_option('--port-range', default='%s,%s' % _DEFAULT_PORT_RANGE,
                    help=('Range of ports for constrained network. Specify as '
                          'two comma separated integers. Default: %default'))
  parser.add_option('--target-ip', default=None,
                    help=('The interface IP address to apply the rules for. '
                          'Default: the external facing interface IP address.'))
  parser.add_option('--set-way', default=None,
                    help=('set incomming or outgoing, out means outgoing. in means incoming. '
                          'Default: both incomming and outgoing'))
  parser.add_option('-v', '--verbose', action='store_true', default=False,
                    help=('Turn on verbose output. Will print all \'ipfw\' '
                          'commands that are executed.'))

  options = parser.parse_args()[0]
  print "options is ", options;
  # Find preset by ID, if specified.
  if options.preset and not _PRESETS_DICT.has_key(options.preset):
    parser.error('Invalid preset: %s' % options.preset)

  # Simple validation of the IP address, if supplied.
  if options.target_ip:
    try:
      socket.inet_aton(options.target_ip)
    except socket.error:
      parser.error('Invalid IP address specified: %s' % options.target_ip)


  # Convert port range into the desired tuple format.
  try:
    if isinstance(options.port_range, str):
      options.port_range = tuple(int(port) for port in
                                 options.port_range.split(','))
      if len(options.port_range) != 2:
        parser.error('Invalid port range specified, please specify two '
                     'integers separated by a comma.')
  except ValueError:
    parser.error('Invalid port range specified.')

  _set_logger(options.verbose)
  return options


def _set_logger(verbose):
  """Setup logging."""
  log_level = _DEFAULT_LOG_LEVEL
  if verbose:
    log_level = logging.DEBUG
  logging.basicConfig(level=log_level, format='%(message)s')


def _main():
  options = _parse_args()

  # Build a configuration object. Override any preset configuration settings if
  # a value of a setting was also given as a flag.
  connection_config = _PRESETS_DICT[options.preset]
  if options.receive_bw is not _DEFAULT_PRESET.receive_bw_kbps:
    connection_config.receive_bw_kbps = options.receive_bw
  if options.send_bw is not _DEFAULT_PRESET.send_bw_kbps:
    connection_config.send_bw_kbps = options.send_bw
  if options.delay is not _DEFAULT_PRESET.delay_ms:
    connection_config.delay_ms = options.delay
  if options.packet_loss is not _DEFAULT_PRESET.packet_loss_percent:
    connection_config.packet_loss_percent = options.packet_loss
  if options.queue is not _DEFAULT_PRESET.queue_slots:
    connection_config.queue_slots = options.queue
  emulator = network_emulator.NetworkEmulator(connection_config,
                                              options.port_range)
  try:
    emulator.check_permissions()
  except network_emulator.NetworkEmulatorError as e:
    logging.error('Error: %s\n\nCause: %s', e.fail_msg, e.error)
    return -1

  if not options.target_ip:
    external_ip = _get_external_ip()
    #external_ip = "192.168.1.100"
  else:
    external_ip = options.target_ip
  
  if not options.set_way:
    set_way = 0;
  elif options.set_way == "outgoing":
    set_way = 2;
  else:
    set_way = 1; 

  logging.info('Constraining traffic to/from IP: %s', external_ip)
  try:
    emulator.emulate(external_ip,set_way)
    logging.info('Started network emulation with the following configuration:\n'
                 '  Receive bandwidth: %s kbps (%s kB/s)\n'
                 '  Send bandwidth   : %s kbps (%s kB/s)\n'
                 '  Delay            : %s ms\n'
                 '  Packet loss      : %s %%\n'
                 '  Queue slots      : %s',
                 connection_config.receive_bw_kbps,
                 connection_config.receive_bw_kbps/8,
                 connection_config.send_bw_kbps,
                 connection_config.send_bw_kbps/8,
                 connection_config.delay_ms,
                 connection_config.packet_loss_percent,
                 connection_config.queue_slots)
    logging.info('Affected traffic: IP traffic on ports %s-%s',
                 options.port_range[0], options.port_range[1])
    raw_input('Press Enter to abort Network Emulation...')
    logging.info('Flushing all Dummynet rules...')
    network_emulator.cleanup()
    logging.info('Completed Network Emulation.')
    return 0
  except network_emulator.NetworkEmulatorError as e:
    logging.error('Error: %s\n\nCause: %s', e.fail_msg, e.error)
    return -2

if __name__ == '__main__':
  sys.exit(_main())
