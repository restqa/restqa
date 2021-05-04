<template functional>
    <div class="vx-breadcrumb" :class="data.staticClass">
        <ul class="flex flex-wrap items-center">
            <li class="inline-flex items-end">
                <router-link to="/">
                    <feather-icon icon="HomeIcon" svgClasses="h-5 w-5 mb-1 stroke-current text-primary" />
                </router-link>
                <span class="breadcrumb-separator mx-2"><feather-icon :icon="props.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
            </li>
            <li v-for="(link, index) in props.route.meta.breadcrumb.slice(1,-1)" :key="index" class="inline-flex items-center">
                <router-link :to="link.url" v-if="link.url">{{ link.title }}</router-link>
                <span class="text-primary cursor-default" v-else>{{ link.title }}</span>
                <span class="breadcrumb-separator mx-2 flex items-start"><feather-icon :icon="props.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
            </li>
            <li class="inline-flex">
                <span v-if="props.route.meta.breadcrumb.slice(-1)[0].active" class="cursor-default">{{ props.route.meta.breadcrumb.slice(-1)[0].title }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default{
  name: 'vx-breadcrumb'
}
</script>
