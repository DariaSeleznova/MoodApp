let activeDropdown = null;
let activeTrigger = null;

function syncTriggerState(trigger, isOpen) {
    if (!trigger) {
        return;
    }

    trigger.setAttribute('aria-expanded', String(isOpen));
}

export function openDropdown(dropdown, trigger = null) {
    if (!dropdown) {
        return;
    }

    if (activeDropdown && activeDropdown !== dropdown) {
        closeDropdown(activeDropdown, activeTrigger);
    }

    dropdown.classList.add('open');
    activeDropdown = dropdown;
    activeTrigger = trigger;
    syncTriggerState(trigger, true);
}

export function closeDropdown(dropdown = activeDropdown, trigger = activeTrigger) {
    if (!dropdown) {
        return;
    }

    dropdown.classList.remove('open');
    syncTriggerState(trigger, false);

    if (activeDropdown === dropdown) {
        activeDropdown = null;
        activeTrigger = null;
    }
}

document.addEventListener('click', (event) => {
    if (activeDropdown && !activeDropdown.contains(event.target)) {
        closeDropdown();
    }
});

