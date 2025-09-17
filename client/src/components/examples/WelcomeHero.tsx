import WelcomeHero from '../WelcomeHero';

export default function WelcomeHeroExample() {
  return (
    <WelcomeHero onGetStarted={() => console.log('Get started clicked')} />
  );
}