<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  members: { type: Array, default: () => [] },
  required: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const query = ref("");
const open = ref(false);
const selectedMember = computed(() => props.members.find(
  (member) => Number(member.id) === Number(props.modelValue),
));
const memberLabel = (member) => `${member.first_name} ${member.last_name}`;
const filteredMembers = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term || selectedMember.value && term === memberLabel(selectedMember.value).toLowerCase()) {
    return props.members;
  }
  return props.members.filter((member) => [
    member.first_name, member.last_name, member.phone, member.email,
  ].filter(Boolean).join(" ").toLowerCase().includes(term));
});

watch([selectedMember, () => props.members], () => {
  if (selectedMember.value) query.value = memberLabel(selectedMember.value);
}, { immediate: true });

const search = () => {
  if (selectedMember.value && query.value !== memberLabel(selectedMember.value)) {
    emit("update:modelValue", "");
  }
  open.value = true;
};
const selectMember = (member) => {
  emit("update:modelValue", member.id);
  query.value = memberLabel(member);
  open.value = false;
};
</script>

<template>
  <div class="member-select">
    <div class="member-search">
      <i class="bi bi-search"></i>
      <input v-model="query" class="form-control" type="search"
        placeholder="Search name, phone, or email" autocomplete="off"
        :required="required && !modelValue" @focus="open=true" @input="search" @blur="open=false" />
    </div>
    <div v-if="open" class="member-options">
      <button v-for="member in filteredMembers" :key="member.id" type="button"
        :class="{ selected: Number(member.id) === Number(modelValue) }"
        @mousedown.prevent="selectMember(member)">
        <span>{{ memberLabel(member) }}</span>
        <small>{{ member.phone }}<template v-if="member.email"> · {{ member.email }}</template></small>
      </button>
      <p v-if="!filteredMembers.length">No matching members found.</p>
    </div>
  </div>
</template>

<style scoped>
.member-select{position:relative}.member-search{position:relative}.member-search i{position:absolute;z-index:1;left:.75rem;top:50%;transform:translateY(-50%);color:#9996a2}.member-search input{padding-left:2.15rem}.member-options{position:absolute;z-index:20;top:calc(100% + .35rem);left:0;right:0;max-height:220px;overflow-y:auto;padding:.35rem;border:1px solid #e5e3eb;border-radius:10px;background:#fff;box-shadow:0 12px 30px rgba(24,24,27,.14)}.member-options button{display:flex;flex-direction:column;width:100%;padding:.65rem .7rem;border:0;border-radius:7px;background:transparent;text-align:left}.member-options button:hover,.member-options button.selected{background:#f3f0ff}.member-options span{font-size:.76rem;font-weight:600}.member-options small{color:#8d8a95;font-size:.65rem}.member-options p{margin:0;padding:.8rem;color:#8d8a95;text-align:center;font-size:.72rem}
</style>
