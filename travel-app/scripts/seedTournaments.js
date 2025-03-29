const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
const City = require('../models/City');

const seedTournaments = async () => {
  // Mock data for development
  const cities = [
    { _id: '63d5f7a9e7a8d1a9e4f8b9a1', name: 'Casablanca' },
    { _id: '63d5f7a9e7a8d1a9e4f8b9a2', name: 'Marrakech' },
    { _id: '63d5f7a9e7a8d1a9e4f8b9a3', name: 'Rabat' }
  ];
  const casablanca = cities[0];
  const marrakech = cities[1];
  const rabat = cities[2];

  const tournaments = [
    {
      name: "FIFA World Cup 2030 - Morocco",
      type: "WorldCup",
      year: 2030,
      hostCities: [casablanca._id, marrakech._id, rabat._id],
      stadiums: [
        {
          name: "Grand Stade de Casablanca",
          city: casablanca._id,
          capacity: 93000,
          image: "/images/stadiums/casablanca.jpg"
        },
        {
          name: "Marrakech Stadium",
          city: marrakech._id, 
          capacity: 65000,
          image: "/images/stadiums/marrakech.jpg"
        }
      ],
      matches: [
        {
          date: new Date('2030-06-13'),
          teams: ['Morocco', 'Portugal'],
          stage: 'Group Stage'
        }
      ]
    },
    {
      name: "Africa Cup of Nations 2025",
      type: "AfricaCup",
      year: 2025,
      hostCities: [casablanca._id, rabat._id],
      stadiums: [
        {
          name: "Prince Moulay Abdellah Stadium",
          city: rabat._id,
          capacity: 53000,
          image: "/images/stadiums/rabat.jpg"
        }
      ]
    }
  ];

  console.log('Development mode - Using mock tournament data');
  console.log(JSON.stringify(tournaments, null, 2));
  process.exit();
};

seedTournaments().catch(err => {
  console.error('Error seeding tournaments:', err);
  process.exit(1);
});