/**
 * StudentCard Component
 * 
 * Displays a single student in card format
 * Demonstrates: Props, component reusability, semantic HTML
 * 
 * WHY CARDS:
 * - Good for mobile/responsive layouts
 * - Easy to style with shadows and borders
 * - Each card is independent (good for grid layouts)
 */

const StudentCard = ({ student, onEdit, onDelete }) => {
  const studentId = student._id || student.id;
  
  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      {/* Student Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {student.name}
          </h3>
          <span className="text-sm text-gray-500">
            ID: {studentId}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="font-medium">Age:</span> 
            {student.age} years old
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Course:</span> 
            {student.course}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(studentId)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default StudentCard;