import fs from 'node:fs/promises'
import automationsInfo from './tests/urls.js' 

async function sendReportToN8N(percy_url, testsType){
    const report = await fs.readFile('./results.json')

    const response = await fetch('https://little-server.vercel.app/receive-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            report: JSON.parse(report),
            requester: automationsInfo.requester,
            branch_url: automationsInfo.deploy_url,
            email: automationsInfo.email_test,
            automationsRan: testsType,
            percy_url
        })
    });
    const data = await response.json();
}

const args = process.argv.slice(2)

sendReportToN8N(args[0], args[1])
