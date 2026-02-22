const ticketCooldown = new Map();

const COOLDOWN = 24 * 60 * 60 * 1000; // 1 jour en millisecondes

function canOpenTicket(userId) {
	const now = Date.now();

	if (!ticketCooldown.has(userId)) {
		ticketCooldown.set(userId, now);
		return true;
	}

	const expiration = ticketCooldown.get(userId) + COOLDOWN;

	if (now < expiration) {
		return false;
	}

	ticketCooldown.set(userId, now);
	return true;
}

module.exports = { canOpenTicket };