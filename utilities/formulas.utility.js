module.exports.parseFormulas = (formulas) => {

    formulas = formulas?.L || [];


    const formulasArray = [];

    formulas.forEach((outerFormula) => {
        const innerFormulas = outerFormula?.L || [];
        innerFormulas.forEach((formula) => {
            let formulaKey = Object.keys(formula.M)[0];
            const formulaValue = formula.M[formulaKey]?.S || '';


            const formulaObject = {};
            formulaObject[formulaKey.replace('.', '')] = formulaValue;

            formulasArray.push(formulaObject);

        });
    });

    return formulasArray;
}



function processFormula(formula, variables) {

    // Replace null values with 0
    Object.keys(variables).forEach(key => {
        if (variables[key] === null) {
            variables[key] = '0';
        }
    });

   
    try {
        // Create a regular expression pattern to match variable names in the formula
        const variablePattern = new RegExp(Object.keys(variables).map(key => `\\b${key}\\b`).join('|'), 'g');

        // Replace variable names with their corresponding values
        const substitutedFormula = formula.replace(variablePattern, match => {
            // Handle negative values properly
            const value = parseFloat(variables[match] || 0);
            return value < 0 ? '(' + value + ')' : value;
        });

      //  console.log(substitutedFormula)


        // Evaluate the substituted formula
        let result = eval(substitutedFormula).toFixed(2);


        // Ensure that the result is a valid number
        result = !isFinite(result) ? ' 0.00' : parseFloat(result);
        

        // console.log(variables)

        // console.log(substitutedFormula)

       //  console.log(result)

        // console.log('-----------*****************----------------')


        return result;
    } catch (error) {
        console.error('Error in parseFormula:', error);
        return null; // Handle the error gracefully
    }
}



module.exports.calculatorCalculations = async (formulas, tonsdata,flow_Values) => {
    try {
     
    
     
        let tonsformulas = module.exports.parseFormulas(formulas);
    

        var shifttons = tonsdata.total_shifttons;
        var mtd  =tonsdata.mtdsTons;

   
 
        let shiftstats=[],mtdstat=[];
   

        // shift tons
        let variables = Object.fromEntries(shifttons.map(entry => [entry.key, entry.Daytons ?? 0]));
        let variablesmtd = Object.fromEntries(mtd.map(entry => [entry.key, entry.month_to_date ?? 0]));

     
      
        if (tonsformulas.length !== 0) {

        shiftstats = tonsformulas.map(formulaObject => {
            const [key, formula] = Object.entries(formulaObject)[0];   
            
            const substitutedFormula = processFormula(formula, variables);
            return { [key]: substitutedFormula };
        });

        mtdstat   = tonsformulas.map(formulaObject => {
            const [key, formula] = Object.entries(formulaObject)[0];        
            const substitutedFormula = processFormula(formula, variablesmtd);
            return { [key]: substitutedFormula };
        });

    


        }



        shiftstats.push({'actual runtime': parseFloat(flow_Values.actualruntime)})
        shiftstats.push({'availability': parseFloat(flow_Values.availability)})
        shiftstats.push({'utilisation': parseFloat(flow_Values.maxUtilization)})

   
        
    

        // Return the calculated stats if needed
        return  {shiftstats ,mtdstat};
    } catch (error) {
        console.error('Error in calculatorCalculations:', error);
        throw new Error('Calculation failed');
    }
};






module.exports.calculateDataPoints = (formulas, shifttonsValues) => {
    formulas.forEach((formula) => {
        const [key, expression] = Object.entries(formula)[0];
        const shifttonsData = {};
        let Daytons = 0;

        for (const item of shifttonsValues) {
            for (const timeInterval in item.Shifttons) {
                if (item.Shifttons.hasOwnProperty(timeInterval)) {
                    let evaluatedFormula = expression;

                    for (const innerItem of shifttonsValues) {
                        const value = innerItem.Shifttons[timeInterval] || 0;
                        evaluatedFormula = evaluatedFormula.replace(new RegExp(innerItem.key, 'g'), value);
                    }

                    const value = Number(eval(evaluatedFormula).toFixed(2));
                    Daytons = value;
                    shifttonsData[timeInterval] = value || 0;
                }
            }
        }

        const obj = {
            key: key,
            Shifttons: shifttonsData,
            Daytons: Daytons.toFixed(2)
        };

        shifttonsValues.push(obj);
    });

    return shifttonsValues;
};
