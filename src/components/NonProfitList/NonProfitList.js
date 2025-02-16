
import useNonprofit from "../../hooks/use-nonprofit";

import Chip from "@mui/material/Chip";
import BuildIcon from "@mui/icons-material/Build";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import NonProfitListTile from "../NonProfitListTile/NonProfitListTile";
import SearchIcon from '@mui/icons-material/Search';

import { useState, useCallback } from "react";
import { Puff } from "react-loading-icons";

import { NonProfitContainer, NonProfitGrid } from "../../styles/nonprofits/styles";

import Head from "next/head";
import {
  ContentContainer,
  InnerContainer,
} from "../../styles/nonprofits/styles";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";
import { Typography } from "@mui/material";

function NonProfitList() {
    let { nonprofits } = useNonprofit();

    const [searchString, setSearchString] = useState('');
    const [needs_help_flag, setNeedsHelpFlag] = useState(true);
    const [production_flag, setProductionFlag] = useState(false);

    const showNeedsHelp = (event) => {
        setNeedsHelpFlag(!needs_help_flag);
    };
    
    const showProduction = (event) => {
        setProductionFlag(!production_flag);
    };

    const onChangeSearchHandler = (event) => {
      setSearchString(event.target.value);
    }

    const needsHelpButton = () => {
        if (needs_help_flag) {
          return (
            <Chip
              icon={<BuildIcon />}
              color="warning"
              style={{ fontSize: "1.5rem" }}
              onClick={showNeedsHelp}
              onDelete={showNeedsHelp}
              label="Needs Help"
            />
          );
        } else {
          return (
            <Chip
              icon={<BuildIcon />}
              color="default"
              variant="outlined"
              style={{ fontSize: "1.5rem" }}
              onClick={showNeedsHelp}
              label="Needs Help"
            />
          );
        }
    };
    

    const productionButton = () => {
        if (production_flag) {
            return (
            <Chip
                icon={<WorkspacePremiumIcon />}
                color="success"
                style={{ fontSize: "1.5rem", marginLeft: "0.5rem" }}
                onClick={showProduction}
                onDelete={showProduction}
                label="Live"
            />
            );
        } else {
            return (
            <Chip
                icon={<WorkspacePremiumIcon />}
                color="default"
                variant="outlined"
                style={{ fontSize: "1.5rem", marginLeft: "0.5rem" }}
                onClick={showProduction}
                label="Live"
            />
            );
        }
    };

    const nonProfitList = useCallback(() => {
      let result = nonprofits;
      
      if (result == null || result.length === 0) {
        return (
            <p>
            Loading... <Puff stroke="#0000FF" /> <Puff stroke="#0000FF" />
            </p>
        );
      }
      
      if (searchString) {
        result = result.filter(
          nonprofit =>
            nonprofit.name.toLowerCase().includes(searchString.toLowerCase()) ||
            nonprofit.description.toLowerCase().includes(searchString.toLowerCase()) 
        );

        if (result == null || result.length === 0) {
          return (
            <Typography variant="h3" color="var(--dark-aluminium)">
              No matching Projects found!
            </Typography>
          )
        }
      }

      return result.map((npo) => {
        let display = true;

        let production_counter = 0;
        let needs_help_counter = 0;
        let hacker_counter = 0;
        let mentor_counter = 0;

        npo.problem_statements.forEach((ps) => {
          if (ps.status === "production") {
            production_counter++;
          } else {
            needs_help_counter++;
          }

          if (ps.helping) {
            ps.helping.forEach((help) => {
              // TODO: "hacker" and "mentor" should probably be exported as consts from somewhere.
              if (help.type === "hacker") {
                hacker_counter++;
              } else if (help.type === "mentor") {
                mentor_counter++;
              }
            });
          }
        });

        if (needs_help_counter === 0 && needs_help_flag) {
          display = false;
        }

        if (production_counter === 0 && production_flag) {
          display = false;
        }

        if (display) {
          return (
            <NonProfitListTile
              npo={npo}
              key={npo.id}
              need_help_problem_statement_count={needs_help_counter}
              in_production_problem_statement_count={production_counter}
              hacker_count={hacker_counter}
              mentor_count={mentor_counter}
              icon="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/volunteer_activism/default/48px.svg"
            />
          );
        } else {
          return "";
        }
      });
    }, [nonprofits, needs_help_flag, production_flag, searchString]);

    return(
        <ContentContainer container>
      <Head>
        <title>
          Nonprofit Project List - Opportunity Hack Developer Portal
        </title>
        <meta
          name="description"
          content="A listing of all of the nonprofits and projects we have worked on from hackathons, senior capstone projects, and internships - we need help from you to push to production!"
        />
      </Head>
      <InnerContainer container>
        <h1 className="content__title">Nonprofit Projects</h1>
        <div className="content__body">
          <div className="profile__header">
            <div className="profile__headline">
              <h3 className="profile__title">
                Review our catalog of nonprofit problems that need your help
              </h3>
              Here you'll find all nonprofits that we've worked with and those
              that need help, we hope that you find something that you'll love
              to work on.
            </div>
          </div>
        {/* TODO: Move everything above here and return to pages/nonprofits/index.js  once MUI has been set up to render server side. */}
        <div className="profile__details">
            {/* TODO: Get search working to make it easier to search all text for what the user is looking for */}
          <Search>
              <SearchIconWrapper>
                  <SearchIcon style={{ fontSize: "1.75rem" }} />
              </SearchIconWrapper>
              <StyledInputBase
                  style={{ fontSize: "1.75rem" }}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={onChangeSearchHandler}
                  value={searchString}
                  autoFocus={true}
              />
          </Search>
                       
            {needsHelpButton()}
            &nbsp;
            {productionButton()}
            <NonProfitContainer>
              <NonProfitGrid>{nonProfitList()}</NonProfitGrid>
            </NonProfitContainer>
          </div>
        {/* TODO: Move everything below here and end of function to pages/nonprofits/index.js once MUI has been set up to render server side. */}
        </div>
      </InnerContainer>
    </ContentContainer>
    );
}

export default NonProfitList;