<script>
    import AddJunior from "./AddJunior.svelte";
    import DeleteJunior from "./DeleteJunior.svelte";
    import EditJunior from "./EditJunior.svelte";
    import RestoreJunior from "./RestoreJunior.svelte";

    let activeTab = $state("Add");

    const selectTab = (tab) => {
        activeTab = tab;
    };
</script>

<section class="junior-admin">
    <nav class="tabs">
        <div
            class="selector"
            class:add={activeTab === "Add"}
            class:edit={activeTab === "Edit"}
            class:delete={activeTab === "Delete"}
            class:restore={activeTab === "Restore"}
        ></div>

        <button
            class:active={activeTab === "Add"}
            onclick={() => selectTab("Add")}
        >
            Add
        </button>

        <button
            class:active={activeTab === "Edit"}
            onclick={() => selectTab("Edit")}
        >
            Edit
        </button>

        <button
            class:active={activeTab === "Delete"}
            onclick={() => selectTab("Delete")}
        >
            Delete
        </button>

        <button
            class:active={activeTab === "Restore"}
            onclick={() => selectTab("Restore")}
        >
            Restore
        </button>
    </nav>
</section>

<section>
    {#if activeTab === "Add"}
        <AddJunior />
    {:else if activeTab === "Edit"}
        <EditJunior />
    {:else if activeTab === "Delete"}
        <DeleteJunior />
    {:else if activeTab === "Delete"}
        <RestoreJunior />
    {/if}
</section>

<style>
    .junior-admin {
        display: flex;
        justify-content: center;
        margin: 30px 0;
    }

    .tabs {
        position: relative;
        display: flex;
        border: 2px solid var(--code-ninjas-blue-main);
        box-shadow: 4px 4px 0 var(--code-ninjas-blue-main);
        overflow: hidden;
        border-radius: 50px;
        height: 35px;
    }

    .tabs button {
        position: relative;
        z-index: 2;
        border: none;
        background: transparent;
        width: 90px;
        padding: 10px 16px;
        font-size: 14px;
        color: var(--code-ninjas-blue-dark);
        cursor: pointer;
        transition: color 0.3s ease;
        font-family: "Comfortaa", sans-serif;
    }

    .tabs button.active {
        color: var(--secondary);
    }

    .tabs button:not(.active):hover {
        color: var(--code-ninjas-blue-dark);
    }

    .selector {
        position: absolute;
        z-index: 1;
        top: 3px;
        left: 3px;
        height: calc(100% - 6px);
        width: calc(25% - 6px);
        border-radius: 50px;
        background: var(--code-ninjas-blue-main);
        transition:
            left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
            width 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .selector.add {
        left: 3px;
    }

    .selector.edit {
        left: calc(25% + 3px);
    }

    .selector.delete {
        left: calc(50% + 3px);
    }

    .selector.restore {
        left: calc(75% + 3px);
    }
</style>
