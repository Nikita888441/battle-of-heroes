
// Enum для типів героїв
enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER",
}

// Enum для типів атак
enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED",
}

// Interface для характеристик героя
interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

// Interface для героя
interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}

// Type для результату атаки
type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

let heroIdCounter = 1;

// Функція створення нового героя
function createHero(name: string, type: HeroType): Hero {
    let stats: HeroStats;
    let attackType: AttackType;

    switch (type) {
        case HeroType.Warrior:
            stats = { health: 120, attack: 15, defense: 10, speed: 5 };
            attackType = AttackType.Physical;
            break;
        case HeroType.Mage:
            stats = { health: 80, attack: 25, defense: 5, speed: 7 };
            attackType = AttackType.Magical;
            break;
        case HeroType.Archer:
            stats = { health: 100, attack: 20, defense: 7, speed: 10 };
            attackType = AttackType.Ranged;
            break;
        default:
            throw new Error("Unknown hero type");
    }

    return {
        id: heroIdCounter++,
        name,
        type,
        attackType,
        stats,
        isAlive: true,
    };
}

// Функція розрахунку пошкодження
function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense;
    const isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    const totalDamage = isCritical ? baseDamage * 2 : baseDamage;
    const finalDamage = Math.max(0, totalDamage);

    defender.stats.health -= finalDamage;
    if (defender.stats.health <= 0) defender.isAlive = false;

    return {
        damage: finalDamage,
        isCritical,
        remainingHealth: Math.max(0, defender.stats.health),
    };
}

// Generic функція для пошуку героя в масиві
function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find((hero) => hero[property] === value);
}

// Функція проведення раунду бою між героями
function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `${hero1.name} або ${hero2.name} вже не можуть битись.`;
    }

    const attacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    const defender = attacker === hero1 ? hero2 : hero1;

    const result = calculateDamage(attacker, defender);

    return `✅ ${attacker.name} атакує ${defender.name} і завдає **${result.damage}** ${
        result.isCritical ? "(🔥 Критичний удар!)" : ""
    }. 🛡️ ${defender.name} має **${result.remainingHealth}** здоров'я.`;
}

// Функція для виводу підсумків бою
function printBattleSummary(heroes: Hero[]) {
    console.log("\n🏆 --- ПІДСУМКИ БОЮ --- 🏆");

    heroes.forEach((hero) => {
        console.log(
            `🔹 ${hero.name} (${hero.type}) | ❤️ Здоров'я: ${hero.stats.health} | ${
                hero.isAlive ? "✅ Живий" : "💀 Мертвий"
            }`
        );
    });

    console.log("🔚 --- БІЙ ЗАВЕРШЕНО --- 🔚\n");
}

// ==========================
// Приклад використання
// ==========================

// Створюємо масив героїв
const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леона", HeroType.Archer),
];

// Пошук героя за властивістю
const foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log("🔍 Знайдений герой:", foundHero);

// Проводимо кілька раундів бою
console.log("--- Початок бою ---");
console.log(battleRound(heroes[0], heroes[1]));
console.log(battleRound(heroes[1], heroes[2]));

// Вивід підсумків
printBattleSummary(heroes);
