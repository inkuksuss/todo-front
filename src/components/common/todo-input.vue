<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  value: { type: String || undefined, required: true },
  placeHolder: { type: String, required: false },
  length: { type: Number, required: false },
  read: { type: Boolean, default: false },
  changeHandler: { type: Function, default: () => {} },
  enterHandler: { type: Function, default: (v: string | undefined) => {} }
});

const inputValue = ref<String | undefined>();

const handleChangeInput = (e: KeyboardEvent) => {
  const newValue = (e.target as any).value;
  props.changeHandler(newValue);
  inputValue.value = newValue;
};

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.isComposing || e.keyCode === 229)  return;
    props.enterHandler(inputValue.value);
  }
}
</script>

<template>
  <div class="todo-input-wrapper">
    <input
      class="border-2 border-black"
      :value="value"
      :placeholder="placeHolder"
      :maxlength="length"
      @input="handleChangeInput"
      @keydown="handleKeyUp"
      :readonly="read"
    />
  </div>
</template>
<style scoped></style>
