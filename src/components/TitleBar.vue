<template>
    <div class="TitleBar">
        AutoZMail
        <div class="controls">
            <button class="minimize-btn" @click="handleMinimize">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    class="bi bi-dash-lg"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                    />
                </svg>
            </button>
            <button class="maximize-btn" @click="handleMaximize">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    class="bi bi-arrows-angle-expand"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"
                    />
                </svg>
            </button>
            <button class="close-btn" @click="handleClose">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    class="bi bi-x-lg"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TitleBar',
    data() {
        return {

        }
    },
    methods: {
        handleClose() {
            window.ipcRenderer.send('win-close')
        },
        handleMaximize() {
            window.ipcRenderer.send('win-maximize')
        },
        handleMinimize() {
            window.ipcRenderer.send('win-minimize')
        },
    }
}
</script>

<style scoped>
.TitleBar {
    width: 100%;
    height: 30px;
    -webkit-app-region: drag;
    user-select: none;
}
.controls {
    position: fixed;
    right: 0;
    top: 0;
    -webkit-app-region: no-drag;
    display: flex;
}
.controls > button {
    background-color: white;
    height: 30px;
    width: 50px;
    border: 0;
}
button:focus-visible {
    outline: 0;
}
.close-btn:hover {
    background-color: rgb(253, 0, 7);
    color: white;
}
.minimize-btn:hover {
    background-color: rgb(238, 238, 238);
}
.maximize-btn:hover {
    background-color: rgb(238, 238, 238);
}
</style>
