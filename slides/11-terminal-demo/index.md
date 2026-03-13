---
theme: ../
layout: default
clicks: 3
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">Terminal Demo</div>

<div class="flex justify-center">
  <div class="w-3/4">
    <Terminal
      :lines="[
        { command: 'npm install @slidev/cli', output: 'added 152 packages in 2.3s' },
        { command: 'npx slidev', output: '  ➜  Local:   http://localhost:3030/' },
        { command: 'npm run build', output: 'dist/index.html  42.8 kB │ gzip: 13.2 kB\n✓ built in 3.21s' }
      ]"
      title="my-project — bash"
      shell="bash"
      :height="380"
      :clicks="$clicks"
    />
  </div>
</div>

<!--
Demo slide showing the Terminal component with animated typing. Each click/arrow advances to the next command.
-->
