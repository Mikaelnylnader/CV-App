-- Create function to handle application changes
CREATE OR REPLACE FUNCTION handle_application_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the application webhook function
  PERFORM net.http_post(
    url := CONCAT(current_setting('app.settings.supabase_functions_url'), '/application-webhook'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key'))
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for job applications
CREATE TRIGGER on_application_change
  AFTER INSERT OR UPDATE
  ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION handle_application_change();

-- Create trigger for interview changes
CREATE TRIGGER on_interview_change
  AFTER INSERT OR UPDATE
  ON application_interviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_application_change();

-- Create trigger for reminder changes
CREATE TRIGGER on_reminder_change
  AFTER INSERT OR UPDATE
  ON application_reminders
  FOR EACH ROW
  EXECUTE FUNCTION handle_application_change(); 