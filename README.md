cube-babel
========================

babel转换器， 配置的config参数，和babel一致，请参考[babel-core]()的用法

usage: 

```
{
    cube: {
        processors: {
            '.js': [
                [
                    'cube-babel', 
                    {
                        presets: [['es2015']],
                        plugins: [
                            ['${plugin-name}', {/** ${config} **/}]
                        ]
                    }
                ]
            ]
        }
    }
```

