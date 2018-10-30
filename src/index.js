import { camel } from 'case';

function install(editor, params) {}

function getVarName(node) {
    return camel(`${node.name}${node.id}`);
}

async function generate(engine, data) {
    let file = '';
    
    engine = engine.clone();
    engine.components = engine.components.map(c => {
        c = Object.assign(Object.create(Object.getPrototypeOf(c)), c)

        c.worker = (node, inputs, outputs) => {
            function add(name, expression) {
                if (!expression) {
                    file += `${name};\n`;
                    return;
                }

                const varName = `${getVarName(node)}${name}`;

                file += `const ${varName} = ${expression};\n`;
                outputs[name] = varName;
            }
            c.code(node, inputs, add);
        }
        c.worker.bind(c);

        return c;
    })

    await engine.process(data);

    return file;
}

export default {
    install,
    generate
}