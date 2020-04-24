/* eslint-disable import/prefer-default-export */

import 'module-alias/register'

import config from '%src/config'

export const chooseAvailableInternalStream = () => `${config.INTERNAL_STREAM_ADDRESS}:${config.INTERNAL_STREAM_PORT_RANGE[0]}`
