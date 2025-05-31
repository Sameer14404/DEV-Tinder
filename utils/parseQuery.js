const parseUserQuery = (message) => {
    const query = {};
    const lowerMessage = message.toLowerCase();
    
    // Enhanced skill extraction with variations
    const skillsMap = {
        'react': ['react', 'reactjs', 'react.js'],
        'node': ['node', 'nodejs', 'node.js'],
        'javascript': ['javascript', 'js'],
        'python': ['python', 'py'],
        'mongodb': ['mongodb', 'mongo'],
        'express': ['express', 'expressjs'],
        'vue': ['vue', 'vuejs', 'vue.js'],
        'angular': ['angular', 'angularjs'],
        'django': ['django'],
        'flask': ['flask'],
        'sql': ['sql', 'mysql', 'postgresql', 'postgres'],
        'aws': ['aws', 'amazon web services'],
        'docker': ['docker'],
        'typescript': ['typescript', 'ts'],
        'java': ['java'],
        'c++': ['c++', 'cpp'],
        'php': ['php'],
        'ruby': ['ruby', 'rails', 'ruby on rails']
    };
    
    const foundSkills = [];
    
    // Check for each skill and its variations
    Object.entries(skillsMap).forEach(([skill, variations]) => {
        for (let variant of variations) {
            if (lowerMessage.includes(variant)) {
                foundSkills.push(skill);
                break; // Found this skill, move to next
            }
        }
    });
    
    if (foundSkills.length > 0) {
        query.skills = {
            $in: foundSkills.map(skill => new RegExp(skill, 'i'))
        };
    }
    
    // Enhanced experience level parsing
    const experiencePatterns = {
        'beginner': ['beginner', 'junior', 'entry level', 'entry-level', 'fresher', 'newcomer'],
        'intermediate': ['intermediate', 'mid level', 'mid-level', 'medium'],
        'advanced': ['advanced', 'senior', 'experienced'],
        'expert': ['expert', 'lead', 'principal', 'architect', 'master']
    };
    
    Object.entries(experiencePatterns).forEach(([level, patterns]) => {
        for (let pattern of patterns) {
            if (lowerMessage.includes(pattern)) {
                query.experienceLevel = level;
                break;
            }
        }
    });
    
    // Enhanced availability parsing
    const availabilityPatterns = {
        'full-time': ['full-time', 'full time', 'fulltime'],
        'part-time': ['part-time', 'part time', 'parttime'],
        'freelance': ['freelance', 'freelancer', 'contract', 'contractor'],
        'unavailable': ['unavailable', 'not available']
    };
    
    Object.entries(availabilityPatterns).forEach(([availability, patterns]) => {
        for (let pattern of patterns) {
            if (lowerMessage.includes(pattern)) {
                query.availability = availability;
                break;
            }
        }
    });
    
    // Location parsing
    const commonLocations = [
        'mumbai', 'delhi', 'bangalore', 'bengaluru', 'pune', 'chennai', 
        'kolkata', 'hyderabad', 'ahmedabad', 'surat', 'jaipur', 'lucknow',
        'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'patna', 'vadodara',
        'ghaziabad', 'ludhiana', 'agra', 'nashik', 'noida', 'gurgaon', 'gurugram'
    ];
    
    // Check for location with prepositions
    const locationRegex = /(?:from|in|at|based in|located in|near)\s+([a-zA-Z]+)/i;
    const locationMatch = lowerMessage.match(locationRegex);
    
    if (locationMatch) {
        query.location = { $regex: locationMatch[1], $options: 'i' };
    } else {
        // Check for location without preposition
        for (let location of commonLocations) {
            if (lowerMessage.includes(location)) {
                query.location = { $regex: location, $options: 'i' };
                break;
            }
        }
    }
    
    // Profession parsing
    const professions = [
        'developer', 'engineer', 'programmer', 'architect', 'designer',
        'analyst', 'consultant', 'manager', 'lead', 'specialist'
    ];
    
    for (let profession of professions) {
        if (lowerMessage.includes(profession)) {
            query.profession = { $regex: profession, $options: 'i' };
            break;
        }
    }
    
    // Language parsing (spoken languages)
    const languages = ['english', 'hindi', 'spanish', 'french', 'german', 'chinese', 'japanese'];
    const foundLanguages = [];
    
    languages.forEach(lang => {
        if (lowerMessage.includes(lang)) {
            foundLanguages.push(lang);
        }
    });
    
    if (foundLanguages.length > 0) {
        query.languages = { $in: foundLanguages.map(lang => new RegExp(lang, 'i')) };
    }
    
    // Handle "all developers" or generic queries
    if (Object.keys(query).length === 0 && 
        (lowerMessage.includes('all developer') || 
         lowerMessage.includes('show developer') ||
         lowerMessage.includes('list developer'))) {
        // Return empty query to get all results
        return {};
    }
    
    return query;
};

module.exports = parseUserQuery;