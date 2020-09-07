<template>
    <div class="col-full" :class="$style.centered">
        <h1 :class="$style['heading-large']">Not Found</h1>
        <p :class="$style['text-large']">
            Oooops, you missed something!
            <router-link :to="{name: 'Home'}">Back to basics.</router-link>
        </p>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style module>
.heading-large {
    font-size: 100px;
}

.text-large {
    font-size: 50px;
    font-weight: 100;
}

.centered {
    text-align: center;
}
</style>