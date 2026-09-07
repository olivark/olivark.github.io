import { spawnSync } from 'node:child_process';

const production = process.argv.includes('--production');
const jekyllArgs = ['exec', 'jekyll', 'build'];
if (process.env.SITE_BASEURL !== undefined) jekyllArgs.push('--baseurl', process.env.SITE_BASEURL);
const env = { ...process.env };
if (production) env.JEKYLL_ENV = 'production';

for (const [command, args] of [
  ['bundle', jekyllArgs],
  ['npm', ['run', 'search:index']],
]) {
  const result = spawnSync(command, args, { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
