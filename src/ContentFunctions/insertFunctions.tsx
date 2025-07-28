export function insertContent(role:string) {
    const randomNames = [
        "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Miller", "Eli Davis",
        "Fiona Garcia", "George Wilson", "Hana Kim", "Ivan Patel", "Julia Adams",
        "Kevin Lee", "Laura Thomas", "Michael Clark", "Nina Lopez", "Oscar Turner",
        "Paula White", "Quentin Hall", "Rachel Lewis", "Sam Walker", "Tina Young",
        "Umar Nelson", "Vera King", "Will Scott", "Xena Brooks", "Yuri Reed",
        "Zara Hughes", "Aaron Grant", "Bella Cooper", "Caleb Rivera", "Daisy Cox"
      ];
      
      const randomEmails = [
        "alice.johnson@example.com","bob.smith@example.com","charlie.brown@example.com", "diana.miller@example.com",
        "eli.davis@example.com",  "fiona.garcia@example.com", "george.wilson@example.com", "hana.kim@example.com",
        "ivan.patel@example.com", "julia.adams@example.com","kevin.lee@example.com","laura.thomas@example.com", "michael.clark@example.com",
         "nina.lopez@example.com", "oscar.turner@example.com", "paula.white@example.com", "quentin.hall@example.com",
        "rachel.lewis@example.com","sam.walker@example.com", "tina.young@example.com", "umar.nelson@example.com",
        "vera.king@example.com", "will.scott@example.com", "xena.brooks@example.com",  "yuri.reed@example.com",
        "zara.hughes@example.com", "aaron.grant@example.com", "bella.cooper@example.com", "caleb.rivera@example.com", "daisy.cox@example.com"
      ];

      const randomNumbers = [
        "(202) 555-0147", "(305) 555-0192", "(415) 555-0119", "(718) 555-0185", "(303) 555-0124",
        "(212) 555-0159", "(480) 555-0170", "(626) 555-0193", "(617) 555-0127", "(206) 555-0141",
        "(704) 555-0106", "(917) 555-0162", "(702) 555-0133", "(832) 555-0195", "(313) 555-0181",
        "(407) 555-0110", "(469) 555-0168", "(615) 555-0176", "(602) 555-0153", "(510) 555-0188",
        "(312) 555-0169", "(973) 555-0172", "(408) 555-0125", "(512) 555-0136", "(919) 555-0154",
        "(646) 555-0191", "(720) 555-0109", "(213) 555-0189", "(414) 555-0175", "(818) 555-0121"
      ];
      
      const randomDates = [
        "01/15/2023", "02/07/2022", "03/12/2021", "04/25/2020", "05/10/2022",
        "06/18/2023", "07/04/2021", "08/22/2020", "09/30/2022", "10/13/2021",
        "11/05/2023", "12/28/2020", "01/02/2022", "02/14/2023", "03/30/2020",
        "04/11/2021", "05/26/2022", "06/09/2020", "07/19/2023", "08/01/2022",
        "09/15/2020", "10/27/2021", "11/16/2022", "12/03/2023", "01/21/2021",
        "02/08/2020", "03/17/2023", "04/29/2021", "05/08/2020", "06/16/2022"
      ];
      
      const relativeTimes = [
        "2 hrs ago", "10 mins ago", "3 days ago", "1 week ago", "30 secs ago",
        "5 hrs ago", "15 mins ago", "4 days ago", "2 weeks ago", "1 hr ago",
        "12 hrs ago", "20 mins ago", "6 days ago", "3 weeks ago", "45 secs ago",
        "9 hrs ago", "25 mins ago", "7 days ago", "1 month ago", "2 mins ago",
        "8 hrs ago", "50 mins ago", "5 days ago", "10 days ago", "6 hrs ago",
        "1 day ago", "18 mins ago", "11 days ago", "4 hrs ago", "35 secs ago"
      ];
      
      const randomPrices: string[] = [
        "$127.53", "$235.99", "$498.10", "$877.65", "$312.25",
        "$714.80", "$956.30", "$645.70", "$428.90", "$289.40",
        "$172.99", "$833.22", "$901.50", "$114.00", "$659.31",
        "$734.95", "$376.88", "$962.17", "$189.75", "$574.60",
        "$649.99", "$102.50", "$810.45", "$541.10", "$721.90",
        "$990.00", "$134.29", "$618.60", "$489.80", "$398.30"
      ];
      

      let shuffled: string[] = [];

      switch (role) {
        case "name":
          shuffled = [...randomNames].sort(() => 0.5 - Math.random());
          break;
        case "email":
          shuffled = [...randomEmails].sort(() => 0.5 - Math.random());
          break;
        case "number":
        case "phone":
        case "phone number":
          shuffled = [...randomNumbers].sort(() => 0.5 - Math.random());
          break;
        
        case "date":
          shuffled = [...randomDates].sort(() => 0.5 - Math.random());
          break;

        case "time":
          shuffled = [...relativeTimes].sort(()=> 0.5 - Math.random());
          break;
        
          case "price":
            shuffled = [...randomPrices].sort(()=> 0.5 - Math.random());
            break;
        default:
          console.warn(`Unsupported role: ${role}`);
          return;
      }
      parent.postMessage(
        {
          pluginMessage: {
            type: `insert-${role}`,
            data: shuffled,
          },
        },
        '*'
      );
    }
    
    