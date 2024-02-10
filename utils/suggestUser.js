exports.generateUsernameSuggestions = (inputUsername) => {
    const suggestions = [];
  
    // Check if the input username is not empty
    if (inputUsername.trim() !== '') {
      // Suggestion 1: Append '_123'
      suggestions.push(inputUsername + '_123');
  
      // Suggestion 2: Prepend 'user_'
      suggestions.push('user_' + inputUsername);
  
      // Suggestion 3: Append a random number
      const randomNum = Math.floor(Math.random() * 1000);
      suggestions.push(inputUsername + '_' + randomNum);
    } else {
      // If the input username is empty, provide default suggestions
      suggestions.push('user123');
      suggestions.push('username_123');
      suggestions.push('new_user');
    }
  
    return suggestions;
  }
