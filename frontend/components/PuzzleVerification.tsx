import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, XCircle } from 'lucide-react';

interface PuzzleVerificationProps {
  onSuccess: () => void;
}

const PuzzleVerification: React.FC<PuzzleVerificationProps> = ({ onSuccess }) => {
  const [puzzle, setPuzzle] = useState({ num1: 0, num2: 0, operation: '+' });
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generatePuzzle();
  }, []);

  const generatePuzzle = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        break;
      default:
        num1 = 10;
        num2 = 5;
    }

    setPuzzle({ num1, num2, operation });
    setUserAnswer('');
    setError('');
  };

  const calculateAnswer = () => {
    const { num1, num2, operation } = puzzle;
    switch (operation) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      default:
        return 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const correctAnswer = calculateAnswer();
    const userAnswerNum = parseInt(userAnswer);

    setTimeout(() => {
      if (userAnswerNum === correctAnswer) {
        onSuccess();
      } else {
        setAttempts(attempts + 1);
        if (attempts >= 2) {
          setError('Too many failed attempts. Generating new puzzle...');
          setTimeout(() => {
            generatePuzzle();
            setAttempts(0);
          }, 2000);
        } else {
          setError(`Incorrect answer. ${3 - attempts - 1} attempts remaining.`);
        }
        setUserAnswer('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSkip = () => {
    generatePuzzle();
    setAttempts(0);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900/95 to-green-600/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Security Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please solve this puzzle to verify you're not a bot
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-4">
              {puzzle.num1} {puzzle.operation} {puzzle.num2} = ?
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-3 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Your answer"
              disabled={isLoading}
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !userAnswer}
              className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="px-6 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Skip
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <Lock className="w-3 h-3 inline mr-1" />
            This verification helps protect your account from automated attacks
          </p>
        </div>
      </div>
    </div>
  );
};

export default PuzzleVerification;