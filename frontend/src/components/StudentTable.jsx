/**
 * StudentTable Component
 * 
 * Displays students in a table format
 * Demonstrates: Semantic HTML5 <table>, props, accessibility
 * 
 * WHY TABLE:
 * - Better for desktop with many students
 * - Easy to compare data across rows
 * - Familiar UI pattern for data-heavy apps
 * - Good for accessibility with proper headers
 */

const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Age
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Course
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => {
            const studentId = student._id || student.id;
            return (
            <tr 
              key={studentId} 
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {studentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {student.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {student.course}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(student)}
                  className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(studentId)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;