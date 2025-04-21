import { useDispatch } from 'react-redux';  // Import useDispatch
import { signinStart, signInSuccess, signInFailure } from '../redux/Slice/SignInSlice'; // Import actions
import { toast } from 'react-toastify'; // Import Toastify
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import { SIGNIN_URL } from 'Constants/utils';

const useSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Hook to navigate after successful login

  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Start the sign-in process and set loading state
    dispatch(signinStart());

    // Validate if the form fields are empty
    if (!values.username || !values.password) {
      setErrors({ general: 'Please fill all the fields' });
      setSubmitting(false);
      return;
    }

    try {
      // Make an API call for sign-in
      const response = await fetch(SIGNIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),  // Send the values in the request body
      });

      // Parse the response data
      const data = await response.json();
      console.log(data,"signindata");

      if (response.ok) {
        // Dispatch signInSuccess action with user data
        dispatch(signInSuccess(data));
        toast.success('Successfully logged in!');  // Show success toast

        // Redirect to the home page or dashboard
        navigate('/');
      } else {
        // Dispatch signInFailure action with error message
        dispatch(signInFailure('Invalid credentials'));
        toast.error('Login failed: Invalid credentials');  // Show error toast
      }
    } catch (error) {
      // Handle any other errors (e.g., network errors)
      dispatch(signInFailure(error.message));
      toast.error('An error occurred. Please try again later.');  // Show error toast
    }

    setSubmitting(false);  // Stop the submitting state after the API call completes
  };

  return { handleSubmit, initialValues };
};

export default useSignIn;
