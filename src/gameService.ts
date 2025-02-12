
interface GameResult {
    username: string;
    leftScore: number;
    rightScore: number;
}

export class GameService {
    saveGameResult(username: string, leftScore: number, rightScore: number): void {
        const result: GameResult = {
            username: username,
            leftScore: leftScore,
            rightScore: rightScore,
        };
 
        // Convert to JSON string
        const jsonString = JSON.stringify(result, null, 2);
        
        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `game_result_${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
 }

// export class GameService {
//     private API_URL = 'http://localhost:3000'; // Your backend URL

//     async saveGameResult(leftScore: number, rightScore: number): Promise<void> {
//         const result: GameResult = {
//             leftScore,
//             rightScore,
//         };

//         try {
//             const response = await fetch(`${this.API_URL}/saveScore`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(result)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to save score');
//             }
//         } catch (error) {
//             console.error('Error saving game result:', error);
//         }
//     }
// }