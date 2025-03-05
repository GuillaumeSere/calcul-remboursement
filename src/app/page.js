'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [mortgageAmount, setMortgageAmount] = useState('');
    const [years, setYears] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [mortgageType, setMortgageType] = useState('');
    const [monthlyRepayment, setMonthlyRepayment] = useState(null);
    const [totalAmountPaid, setTotalAmountPaid] = useState(null); // Ajout de l'état pour le montant total remboursé
    const [errors, setErrors] = useState({
        mortgageAmount: '',
        years: '',
        interestRate: '',
        mortgageType: '',
    });
    const [showResults, setShowResults] = useState(false); // Ajout de l'état pour afficher ou non les résultats
    const [isMortgageFocused, setIsMortgageFocused] = useState(false);
    const [isYearsFocused, setIsYearsFocused] = useState(false);
    const [isInterestFocused, setIsInterestFocused] = useState(false);

    useEffect(() => {
        const calculateRepayments = () => {
            const principal = parseFloat(mortgageAmount.replace(/,/g, ''));
            const rate = parseFloat(interestRate) / 100 / 12;
            const payments = parseInt(years) * 12;

            if (mortgageType === 'repayment') {
                const numerator = rate * Math.pow(1 + rate, payments);
                const denominator = Math.pow(1 + rate, payments) - 1;
                const monthly = principal * (numerator / denominator);
                setMonthlyRepayment(monthly.toFixed(2));
                // Calcul du montant total remboursé pour le type de remboursement
                const totalPaid = monthly * payments;
                setTotalAmountPaid(totalPaid.toFixed(2));
            } else {
                const monthly = (principal * rate) + (principal / payments);
                setMonthlyRepayment(monthly.toFixed(2));
                // Calcul du montant total remboursé pour le type d'intérêt uniquement
                const totalPaid = (monthly * payments) + principal;
                setTotalAmountPaid(totalPaid.toFixed(2));
            }
        };

        calculateRepayments();
    }, [mortgageAmount, years, interestRate, mortgageType]);

    const validateForm = () => {
        const errors = {
            mortgageAmount: '',
            years: '',
            interestRate: '',
            mortgageType: '',
        };

        if (!mortgageAmount) {
            errors.mortgageAmount = 'This field is required';
        } else if (isNaN(mortgageAmount.replace(/,/g, '')) || mortgageAmount.replace(/,/g, '') <= 0) {
            errors.mortgageAmount = 'The amount must be positive';
        }

        if (!years) {
            errors.years = 'This field is required';
        } else if (isNaN(years) || years <= 0) {
            errors.years = 'The number must be positive';
        }

        if (!interestRate) {
            errors.interestRate = 'This field is required';
        } else if (isNaN(interestRate) || interestRate <= 0) {
            errors.interestRate = 'The taux must be positive';
        }

        if (!mortgageType) {
            errors.mortgageType = 'This field is required';
        }

        setErrors(errors);
        if (Object.values(errors).every(error => error === '')) {
            setShowResults(true); // Afficher les résultats si le formulaire est valide
        }
    };

    const handleMortgageAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setMortgageAmount(formattedValue);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white  rounded-2xl shadow-md flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold link">Mortgage Calculator</h1>
                        <button
                            className="underline"
                            onClick={() => {
                                setMortgageAmount('');
                                setYears('');
                                setInterestRate('');
                                setMortgageType('');
                                setMonthlyRepayment(null);
                                setTotalAmountPaid(null); // Réinitialisation du montant total remboursé
                                setErrors({
                                    mortgageAmount: '',
                                    years: '',
                                    interestRate: '',
                                    mortgageType: '',
                                });
                                setShowResults(false); // Réinitialisation de l'affichage des résultats
                            }}
                            aria-label="Réinitialiser le formulaire"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-2">Mortgage Amount</h2>
                            <div className="relative">
                                <span className={`absolute devise left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                                    errors.mortgageAmount 
                                    ? 'error' 
                                    : isMortgageFocused 
                                        ? ' active' 
                                        : 'no-active'
                                }`}>£</span>
                                <input
                                    type="text"
                                    value={mortgageAmount}
                                    onChange={handleMortgageAmountChange}
                                    onFocus={() => setIsMortgageFocused(true)}
                                    onBlur={() => setIsMortgageFocused(false)}
                                    className={`link w-full p-2 border rounded ${
                                        errors.mortgageAmount 
                                        ? 'border-red-600' 
                                        : 'focus:border-lime-500'
                                    } pl-14`}
                                    aria-label="Montant de l'hypothèque"
                                    aria-describedby="mortgageAmountError"
                                    tabIndex="0"
                                    onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                                />
                            </div>
                            {errors.mortgageAmount && <p id="mortgageAmountError" className="text-red-600 text-sm mt-2">{errors.mortgageAmount}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className='relative'>
                                <h2 className="mb-2">Montage Term</h2>
                                <span className={`absolute years transform -translate-y-1/2 w-5 h-5 transition-colors ${
                                    errors.years 
                                    ? 'error' 
                                    : isYearsFocused 
                                        ? 'active' 
                                        : 'no-active'
                                }`}>years</span>
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(e.target.value)}
                                    onFocus={() => setIsYearsFocused(true)}
                                    onBlur={() => setIsYearsFocused(false)}
                                    className={`w-52 p-2 border link rounded ${
                                        errors.years 
                                        ? 'border-red-600' 
                                        : 'focus:border-lime-500'
                                    }`}
                                    aria-label="Nombre d'années"
                                    aria-describedby="yearsError"
                                    tabIndex="0"
                                    onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                                />
                                {errors.years && <p id="yearsError" className="text-red-600 text-sm mt-2">{errors.years}</p>}
                            </div>

                            <div className='relative'>
                                <h2 className="mb-2">Interest Rate</h2>
                                <span className={`absolute pourcentage transform -translate-y-1/2 w-5 h-5 transition-colors ${
                                    errors.interestRate 
                                    ? 'error' 
                                    : isInterestFocused 
                                        ? 'active' 
                                        : 'no-active'
                                }`}>%</span>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    onFocus={() => setIsInterestFocused(true)}
                                    onBlur={() => setIsInterestFocused(false)}
                                    className={`w-52 p-2 border link rounded ${
                                        errors.interestRate 
                                        ? 'border-red-600' 
                                        : 'focus:border-lime-500'
                                    }`}
                                    aria-label="Taux d'intérêt"
                                    aria-describedby="interestRateError"
                                    tabIndex="0"
                                    onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                                />
                                {errors.interestRate && <p id="interestRateError" className="text-red-600 text-sm mt-2">{errors.interestRate}</p>}
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2">Mortgage Type</h2>
                            <div className="flex relative flex-col space-x-4">
                                <label htmlFor="repayment" className="radio-label flex items-center space-x-2">
                                    <input
                                        id="repayment"
                                        type="radio"
                                        name="mortgageType"
                                        value="repayment"
                                        checked={mortgageType === 'repayment'}
                                        onChange={() => setMortgageType('repayment')}
                                        className="form-radio custom-radio required:border-red-600"
                                        aria-label="Type d'hypothèque : remboursement"
                                        tabIndex="0"
                                        onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                                    />
                                    <span className="link">Repayment</span>
                                </label>
                                <label htmlFor="interest-only" className="radio-label flex items-center space-x-2">
                                    <input
                                        id="interest-only"
                                        type="radio"
                                        name="mortgageType"
                                        checked={mortgageType === 'interest-only'}
                                        onChange={() => setMortgageType('interest-only')}
                                        className="form-radio custom-radio required:border-red-600"
                                        aria-label="Type d'hypothèque : intérêt uniquement"
                                        tabIndex="0"
                                        onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                                    />
                                    <span className="link">Interest Only</span>
                                </label>
                            </div>
                            {errors.mortgageType && <p className="text-red-600 text-sm mt-2">{errors.mortgageType}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={validateForm}
                            className="btn w-2xs  text-white py-2 rounded-full  transition-colors duration-200"
                            aria-label="Calculer les remboursements"
                            tabIndex="0"
                            onKeyDown={(e) => e.key === 'Enter' && validateForm()}
                        >
                            <img src='../../../assets/images/icon-calculator.svg' alt='calculator' />
                            <p>Calculate Repayments</p>
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 box p-9 rounded-bl-4xl rounded-r-2xl">
                    {showResults && totalAmountPaid !== null ? (
                        <div className='w-full p-4 card'>
                            <h2 className="text-lg text-white font-semibold mb-2">Your results</h2>
                            <p className='text-card'>Your results are shown below based on the information you provided. To adjust the results, edit the form and click"calculate repayments"aigain.</p>
                            <div className='card-box'>
                                <p className="description-card text-xl">
                                    <span>Your monthly repayments</span><strong className='number'>£{Number(monthlyRepayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                                </p><hr></hr>
                                <p className="description text-xl mt-2">
                                    <span>Total you'll repay over the term</span><strong className='total'>£{Number(totalAmountPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='box-result'>
                            <img src="../../../assets/images/illustration-empty.svg" alt="empty" />
                            <h2>Results shown here</h2>
                            <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}






