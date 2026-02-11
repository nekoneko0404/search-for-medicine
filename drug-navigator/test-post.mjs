
async function test() {
    const payload = {
        drugName: "アストミン",
        context: { isChild: false, isPregnant: false, isLactating: false, isRenal: false },
        provider: "system"
    };

    try {
        console.log("Sending request to http://localhost:3001/api/suggest...");
        const response = await fetch("http://localhost:3001/api/suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Test Error:", e.message);
    }
}

test();
