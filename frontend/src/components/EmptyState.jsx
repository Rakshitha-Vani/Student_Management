/**
 * EmptyState Component
 * 
 * Displayed when there are no students to show
 * Demonstrates: Component reusability, semantic HTML
 */

const EmptyState = ({ title = 'No students found', message = 'Add your first student to get started.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">📚</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;