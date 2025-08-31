const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });

  const envPath = path.resolve(__dirname, '.env');
  let env = '';
  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, 'utf8');
    env = env.replace(/^BACKEND_URL=.*$/m, 'BACKEND_URL=' + tunnel.url);
    if (!/^BACKEND_URL=/m.test(env)) {
      env += `\nBACKEND_URL=${tunnel.url}\n`;
    }
  } else {
    env = `BACKEND_URL=${tunnel.url}\n`;
  }
  fs.writeFileSync(envPath, env);

  console.log(`LocalTunnel running at: ${tunnel.url}`);
  // Now run the dev servers
  const { spawn } = require('child_process');
  const child = spawn('pnpm', ['--parallel', '-r', 'run', 'start:dev'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    tunnel.close();
    process.exit(code);
  });
})();
