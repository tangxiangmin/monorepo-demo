const {babelInclude,} = require('customize-cra')

const path = require('path')

module.exports = (config, env) => {
    // 各个workspace直接输出原始代码，因此需要加入babel
    babelInclude([
        path.resolve('../../packages'),
    ])(config)
    return config
}
