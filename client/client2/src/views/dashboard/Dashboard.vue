<template>
    <div>
        dashboard
        {{adminStore}}
    </div>
</template>

<script setup lang="ts">
import { AdminStore } from "../../stores/AdminStore";
const adminStore = AdminStore();
</script>

<style scoped>

</style>