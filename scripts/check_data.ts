
async function run() {
    try {
        const fetch = (await import('node-fetch')).default || global.fetch;

        const pRes = await fetch('http://localhost:3000/api/profile');
        const profile = await pRes.json();
        console.log('SPECS:', JSON.stringify(profile.specialization));

        const tRes = await fetch('http://localhost:3000/api/tools');
        const tools = await tRes.json();
        console.log('TOOLS:', JSON.stringify(tools.map((t: any) => t.label)));

    } catch (e) {
        console.error(e);
    }
}
run();
