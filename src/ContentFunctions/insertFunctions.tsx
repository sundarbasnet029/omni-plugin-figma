export function insertName() {
    const randomNames = [
        "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Miller", "Eli Davis",
        "Fiona Garcia", "George Wilson", "Hana Kim", "Ivan Patel", "Julia Adams",
        "Kevin Lee", "Laura Thomas", "Michael Clark", "Nina Lopez", "Oscar Turner",
        "Paula White", "Quentin Hall", "Rachel Lewis", "Sam Walker", "Tina Young",
        "Umar Nelson", "Vera King", "Will Scott", "Xena Brooks", "Yuri Reed",
        "Zara Hughes", "Aaron Grant", "Bella Cooper", "Caleb Rivera", "Daisy Cox"
      ];
      
      const shuffled = [...randomNames].sort(() => 0.5 - Math.random());
      parent.postMessage(
        {
          pluginMessage: {
            type: 'insert-names',
            names: shuffled,
          },
        },
        '*'
      );
    }
    
  

  