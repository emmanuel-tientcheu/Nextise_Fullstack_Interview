// lib/email/EmailTemplates.ts
import { AssignmentEmailData } from './types'

export class EmailTemplates {
  
  static getSubject(assignment: AssignmentEmailData): string {
    return `📚 Course Assignment: ${assignment.course.courseName}`
  }

  static getHtmlContent(assignment: AssignmentEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Assignment</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px -20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 10px 0 0;
            opacity: 0.9;
          }
          h2 {
            color: #333;
            font-size: 18px;
            margin: 20px 0 10px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
          }
          .course-details, .trainer-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .detail-row {
            display: flex;
            margin-bottom: 10px;
            padding: 5px 0;
          }
          .detail-label {
            width: 120px;
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            flex: 1;
            color: #333;
          }
          .badge {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          @media (max-width: 480px) {
            .detail-row {
              flex-direction: column;
            }
            .detail-label {
              width: auto;
              margin-bottom: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Course Assignment</h1>
            <p>You have been assigned to a new course!</p>
          </div>

          <div class="course-details">
            <h2>📖 Course Details</h2>
            <div class="detail-row">
              <div class="detail-label">Course Name:</div>
              <div class="detail-value"><strong>${assignment.course.courseName}</strong></div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Date & Time:</div>
              <div class="detail-value">${new Date(assignment.course.courseDate).toLocaleString()}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Location:</div>
              <div class="detail-value">${assignment.course.courseLocation}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Participants:</div>
              <div class="detail-value">${assignment.course.courseParticipants}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Course Price:</div>
              <div class="detail-value">€${assignment.course.coursePrice.toLocaleString()}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Trainer Compensation:</div>
              <div class="detail-value">€${assignment.course.courseTrainerPrice.toLocaleString()}</div>
            </div>
            ${assignment.course.courseNotes ? `
            <div class="detail-row">
              <div class="detail-label">Notes:</div>
              <div class="detail-value">${assignment.course.courseNotes}</div>
            </div>
            ` : ''}
          </div>

          <div class="trainer-details">
            <h2>👨‍🏫 Trainer Information</h2>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${assignment.trainer.trainerName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${assignment.trainer.trainerEmail}</div>
            </div>
          </div>

          <div style="text-align: center;">
            <span class="badge">Assigned on ${new Date(assignment.assignmentDate).toLocaleDateString()}</span>
          </div>

          <div class="footer">
            <p>This is an automated message from the Seminar Management Platform.</p>
            <p>Please contact the administrator if you have any questions.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  static getTextContent(assignment: AssignmentEmailData): string {
    return `
NEW COURSE ASSIGNMENT
=====================

Dear ${assignment.trainer.trainerName},

You have been assigned to a new course:

COURSE DETAILS:
- Course Name: ${assignment.course.courseName}
- Date & Time: ${new Date(assignment.course.courseDate).toLocaleString()}
- Location: ${assignment.course.courseLocation}
- Participants: ${assignment.course.courseParticipants}
- Course Price: €${assignment.course.coursePrice.toLocaleString()}
- Trainer Compensation: €${assignment.course.courseTrainerPrice.toLocaleString()}
${assignment.course.courseNotes ? `- Notes: ${assignment.course.courseNotes}` : ''}

TRAINER INFORMATION:
- Name: ${assignment.trainer.trainerName}
- Email: ${assignment.trainer.trainerEmail}

Assigned on: ${new Date(assignment.assignmentDate).toLocaleDateString()}

---
Seminar Management Platform
    `
  }
}