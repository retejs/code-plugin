function install(editor, params) {}

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

                const varName = `${node.name.toLowerCase()}${node.id}${name}`;

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