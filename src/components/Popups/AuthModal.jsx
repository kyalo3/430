import logo from '../../assets/images/logo.png'
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import MinimalLogin from './MinimalLogin';
import DonorForm from './DonorForm';
import RecipientForm from './RecipientForm';
import VolunteerForm from './VolunteerForm';



// import countyData from '../../counties';
// import businessCategories from '../../business';
// import Select from 'react-select';

export const AuthModal = ({ isOpen, togglePopup, popupType }) => {
  const [showProfileForm, setShowProfileForm] = useState(null);
  React.useEffect(() => {
    const handler = (e) => {
      setShowProfileForm(e.detail.role);
    };
    window.addEventListener('showProfileForm', handler);
    return () => window.removeEventListener('showProfileForm', handler);
  }, []);
  if (!isOpen) return null;
  const handleSwitch = (switchTo) => {
    togglePopup(switchTo);
  }
  return (
    <div className="fixed inset-0 z-50 content-center w-full h-full bg-gray-600 bg-opacity-50" id="my-modal">
      <div className="relative mx-auto my-auto px-32 py-4 shadow-lg rounded-2xl bg-white w-1/2 ">
        <button onClick={() => togglePopup('')}
        className="absolute font-medium text-l top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full"
        >
          &times;
        </button>
        <img className="w-24 mx-auto mb-0 h-auto" src={logo} alt="Logo" />
        <p className="text-emerald-700 text-l font-bold mb-4">Join businesses and individuals across Kenya already partnering with us</p>
        {showProfileForm === 'donor' ?
          <DonorForm handleSwitch={handleSwitch} />
        : showProfileForm === 'recipient' ?
          <RecipientForm handleSwitch={handleSwitch} />
        : showProfileForm === 'volunteer' ?
          <VolunteerForm handleSwitch={handleSwitch} />
        : popupType === 'register' ?
          <RegistrationForm handleSwitch = {handleSwitch}/>
        : popupType === 'login' ?
          <>
            <MinimalLogin />
            {/* <LoginForm handleSwitch = {handleSwitch}/> */}
          </>
        : popupType === 'recipient' ?
          <RecipientForm handleSwitch = {handleSwitch}/>
        : 
          <DonorForm handleSwitch = {handleSwitch} />
        }
      </div>
    </div>
  );
};
