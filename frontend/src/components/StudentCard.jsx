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

import { API_BASE_URL } from '../services/studentService';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const studentId = student._id || student.id;
  
  // Resolve image URL (Cloudinary vs Local)
  const imageUrl = student.profileImage?.startsWith('http') 
    ? student.profileImage 
    : `${API_BASE_URL}${student.profileImage}`;
  
  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Student Image / Avatar */}
      <div className="relative h-48 w-full bg-gray-200">
        {student.profileImage ? (
          <img 
            src={imageUrl} 
            alt={student.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
            <span className="text-5xl font-bold text-white opacity-40">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Student Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {student.name}
            </h3>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 pt-2">
            <p className="flex items-center gap-2">
              <span className="p-1 px-2 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase">Age</span> 
              {student.age}
            </p>
            <p className="flex items-center gap-2">
              <span className="p-1 px-2 bg-purple-50 text-purple-700 rounded-md text-xs font-bold uppercase">Course</span> 
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
      </div>
    </article>
  );
};

export default StudentCard;