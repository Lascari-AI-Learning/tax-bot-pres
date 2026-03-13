---
theme: ../
layout: center
clicks: 4
---

<div class="text-4xl text-center mb-4 text-gray-900">Three to One Takeaway Template</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
    <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-blue-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        First observation or context<br/><br/> <span class="font-semibold text-xl">Key insight <span class="text-blue-600 text-2xl">highlighted</span> becomes clear</span>
      </p>
    </div>
    <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-green-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        Second observation or context<br/><br/> <span class="font-semibold text-xl">Another insight <span class="text-green-600 text-2xl">emphasized</span> makes sense</span>
      </p>
    </div>
    <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-purple-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        Third observation or context<br/><br/> <span class="font-semibold text-xl">Final insight <span class="text-purple-600 text-2xl">important</span> is revealed</span>
      </p>
    </div>
</div>

  <div :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="grid grid-cols-5 gap-4 transition-opacity duration-300">
    <div></div>
    <div class="col-span-3 bg-white border-orange-600 border-1 rounded-lg p-4 text-lg text-gray-900 font-bold text-center">
      <p>
        The main takeaway from these observations: <br/><br/>It's all about <span class="text-orange-600 font-semibold text-xl">the core message</span> that ties everything together
      </p>
    </div>
    <div></div>
  </div>
