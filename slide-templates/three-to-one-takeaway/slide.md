---
theme: ../
layout: center
clicks: 4
---

<div class="text-4xl text-center mb-4 text-gray-900">{{title}}</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
    <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-{{idea1_color}}-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        {{idea1_lead}}<br/><br/> <span class="font-semibold text-xl">{{idea1_action}} <span class=" text-{{idea1_color}}-600 text-2xl">{{idea1_emphasis}}</span> {{idea1_result}}</span>
      </p>
    </div>
    <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-{{idea2_color}}-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        {{idea2_lead}}<br/><br/> <span class="font-semibold text-xl">{{idea2_action}} <span class=" text-{{idea2_color}}-600 text-2xl">{{idea2_emphasis}}</span> {{idea2_result}}</span>
      </p>
    </div>
    <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-{{idea3_color}}-600 border-1 rounded-lg p-4 text-sm text-center flex items-center justify-center transition-opacity duration-300">
      <p>
        {{idea3_lead}}<br/><br/> <span class="font-semibold text-xl">{{idea3_action}} <span class=" text-{{idea3_color}}-600 text-2xl">{{idea3_emphasis}}</span> {{idea3_result}}</span>
      </p>
    </div>
</div>

  <div :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="grid grid-cols-5 gap-4 transition-opacity duration-300">
    <div></div>
    <div class="col-span-3 bg-white border-{{takeaway_color}}-600 border-1 rounded-lg p-4 text-lg text-gray-900 font-bold text-center">
      <p>
        {{takeaway_statement}} <br/><br/>{{takeaway_preemphasis}} <span class="text-{{takeaway_color}}-600 font-semibold text-xl">{{takeaway_emphasis}}</span> {{takeaway_postemphasis}}
      </p>
    </div>
    <div></div>
  </div>