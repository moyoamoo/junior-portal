<script>
    import confetti from "canvas-confetti";
    let { activity, theme, onComplete, adminMode } = $props();

    let checkboxColour = $derived(theme["--stripe-primary"] || "#C77E0A");

    const handleClick = (event) => {
        const newCompleted = !activity.completed;

        if (!adminMode && activity.completed) {
            return;
        }

        if (!adminMode) {
            // Get the position of the checkbox
            const rect = event.currentTarget
                .closest(".container")
                .getBoundingClientRect();

            // Convert the checkbox position into canvas-confetti coordinates
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            const colors = [
                "#FF595E",
                "#FFCA3A",
                "#8AC926",
                "#1982C4",
                "#6A4C93",
                "#FF70A6",
                "#00C2A8",
            ];

            // First burst
            confetti({
                particleCount: 35,
                spread: 70,
                startVelocity: 25,
                gravity: 0.8,
                ticks: 180,
                colors,
                origin: {
                    x,
                    y,
                },
            });

            // Second, smaller burst
            setTimeout(() => {
                confetti({
                    particleCount: 25,
                    spread: 100,
                    startVelocity: 18,
                    gravity: 0.7,
                    ticks: 200,
                    colors,
                    origin: {
                        x,
                        y,
                    },
                });
            }, 100);
        }

        onComplete(newCompleted);
    };
</script>

<td class="completed">
    <label class="container" style={`--stripe-checkmark-bg: ${checkboxColour}`}>
        <input
            type="checkbox"
            disabled={activity.completed && !adminMode}
            checked={activity.completed}
            onclick={handleClick}
        />
        <div class="checkmark"></div>
    </label>
</td>

<style>
    .completed {
        text-align: center;
        vertical-align: middle;
    }

    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .container {
        display: inline-block;
        position: relative;
        cursor: pointer;
        font-size: 20px;
        user-select: none;
        margin: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: relative;
        top: 0;
        left: 0;
        height: 2.3em;
        width: 2.3em;
        background-color: #ccc;
        border-radius: 50%;
        transition: 0.4s;
    }

    /* When the checkbox is checked, add a background */
    .container input:checked ~ .checkmark {
        box-shadow: none;
        background-color: var(--stripe-checkmark-bg) !important;
        transform: rotateX(360deg);
    }

    .container input:checked ~ .checkmark:hover {
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }

    /* Create the checkmark/indicator */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
        left: 0.96em;
        top: 0.7em;
        width: 0.25em;
        height: 0.5em;
        border: solid white;
        border-width: 0 0.15em 0.15em 0;
        /*box-shadow: 0.1em 0.1em 0em 0 rgba(0, 0, 0, 0.3);*/
        transform: rotate(45deg);
    }
</style>
