import 'module-alias/register'

import config from '%src/config'
import logger from '%src/lib/logger'

const allInternalStreamConfigurations = config.INTERNAL_STREAM_PORT_RANGE.map((port) => `${config.INTERNAL_STREAM_ADDRESS}:${port}`)

logger.info(`All configured address/port combinations:\n${allInternalStreamConfigurations.join('\n')}`)
