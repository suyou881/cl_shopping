const continents = [
    { id: 1, name: "Africa" },
    { id: 2, name: "Europe" },
    { id: 3, name: "Asia" },
    { id: 4, name: "North America" },
    { id: 5, name: "South America" },
    { id: 6, name: "Australia" },
    { id: 7, name: "Antarctica" },
];

const price = [
    { id: 1, name: "Any", array: [] },
    { id: 2, name: "$0 to $199", array: [0, 199] },
    { id: 3, name: "$200 to $249", array: [200, 249] },
    { id: 4, name: "$250 to $279", array: [250, 279] },
    { id: 5, name: "$280 to $299", array: [280, 299] },
    { id: 6, name: "More than $300", array: [300, 9999999] },
];

export { continents, price };
